import Types from '../types'
import {_projectModels, handleData} from '../ActionUtil'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import ProjectModel from '../../model/ProjectModel'

// 加载收藏项目
export function onLoadFavoriteData (flag, isShowLoading) {
  return dispatch => {
    if(isShowLoading) {
      dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag})
    }
    new FavoriteDao(flag).getAllItems()
      .then(items => {
        let resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({type: Types.FAVORITE_LOAD_SUCCESS, projectModels: resultData, storeName: flag});
      })
      .catch(e => {
        console.log(e);
        dispatch({type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag});
      })
  }
}

// 加载更多
export function onLoadMorePopular (storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => {//模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex
        })
      } else {
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
          dispatch({
            type: Types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data,
          })
        })
      }
    }, 500)
  }
}

