import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

// 获取最热的异步action
export function onRefreshPopular (storeName, url, pageSize) {
  return dispatch => {
    dispatch({type: Types.POPULAR_REFRESH, storeName: storeName})
    let dataStore = new DataStore()
    dataStore.fetchData(url)
      .then(data => {
        handleData(dispatch, storeName, data, pageSize)
      })
      .catch(error => {
        console.log(error)
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName,
          error
        })
      })
  }
}

// 加载更多
export function onLoadMorePopular (storeName, pageIndex, pageSize, dataArray = [], callBack) {
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
        dispatch({
          type: Types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModels: dataArray.slice(0, max)
        })
      }
    }, 500)
  }
}

function handleData (dispatch, storeName, data, pageSize) {
  let fixItems = []
  if (data && data.data && data.data.items) {
    fixItems = data.data.items
  }
  dispatch({
    type: Types.POPULAR_REFRESH_SUCCESS,
    items: fixItems,
    projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),
    storeName,
    pageIndex: 1
  })

}
