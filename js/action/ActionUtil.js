/**
 * 处理下拉刷新的数据
 * @param actionType
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 * @param favoriteDao
 */
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'

/**
 * 处理数据
 * @param actionType
 * @param dispatch
 * @param storeName
 * @param data
 * @param pageSize
 * @param favoriteDao
 * @param params 其他参数
 */
export function handleData (actionType, dispatch, storeName, data, pageSize, favoriteDao) {
  console.log('favoriteDao------>', favoriteDao)
  let fixItems = []
  if (data && data.data) {
    if (Array.isArray(data.data)) {
      fixItems = data.data
    } else if (Array.isArray(data.data.items)) {
      fixItems = data.data.items
    }
  }
  const showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize) // 第一次加载数据
  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1
    })
  })

}

/**
 * 通过本地的收藏状态包装Item
 * @param showItems
 * @param favoriteDao
 * @param callback
 * @returns {Promise<void>}
 * @private
 */
export async function _projectModels (showItems, favoriteDao, callback) {
  let keys = []
  try {
    //获取收藏的key
    console.log(55555555, showItems, favoriteDao)
    keys = await favoriteDao.getFavoriteKeys()
  } catch (e) {
    console.log(e)
  }
  let projectModels = []
  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
  }
  doCallBack(callback, projectModels)
}

export const doCallBack = (callBack, object) => {
  if (typeof callBack === 'function') {
    console.log('projectModels------>', object)
    callBack(object)
  }
}
