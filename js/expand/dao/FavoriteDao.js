import {AsyncStorage} from 'react-native'
 const FACORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
  constructor (flag) {
    this.favoriteKey = FACORITE_KEY_PREFIX + flag;
  }
 // 收藏项目，保存收藏的项目
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {//更新Favorite的key
        console.log('保存收藏的项目----->', key)
        this.updateFavoriteKeys(key, true);
      }
    });
  }

  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) =>{
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index =favoriteKeys.indexOf(key)
        if (isAdd) {  // 如果是添加且key不存在则添加到数组
          if (index === -1) favoriteKeys.push(key);
          console.log('favoriteKeys---->',favoriteKeys)
        } else {  // 如果是删除且key存在则从数组中删除
          if (index !== -1) favoriteKeys.splice(index, 1)
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
        console.log('this.favoriteKey------->', JSON.stringify(favoriteKeys))
      }
    })
  }
 // 获取收藏的Repository对应的key
  getFavoriteKeys() {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(this.favoriteKey, (error, result) => {
        if (!error) {
          try {
            console.log('999999111---->',result)
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
        } else {
          reject(error);
        }
      });
    });
  }
 // 取消收藏
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key, (error, result) =>{
      if (!error) {
        this.updateFavoriteKeys(key, false)
      }
    })
  }
  // 获取收藏所有的项目
  getAllItems() {
    return new Promise((resolve, reject) => {
      this.getFavoriteKeys().then((keys) =>{
        let items = [];
        if (keys) {
          AsyncStorage.multiGet(keys, (err, stores) => {
            try {
              stores.map((result, i, store) => {
                let key = store[i][0];
                let value = store[i][1];
                if (value) items.push(JSON.parse(value));
              });
              resolve(items);
            } catch (e) {
              reject(e)
            }
          });
        } else {
          resolve(items);
        }
      }) .catch((e) => {
        reject(e)
      })
    });
  }

 }
