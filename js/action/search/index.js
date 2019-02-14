import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'
import { _projectModels, doCallBack, handleData } from '../ActionUtil'
import ArrayUtil from '../../util/ArrayUtil'
import Utils from '../../util/Utils'
const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];

// 获取最热的异步action
export function onSearch (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
  return dispatch => {
    dispatch({type: Types.SEARCH_REFRESH})
    fetch(genFetchUrl(inputKey)).then(response=>{
      return hasCancel(token) ? null : response.json();  // 如果任务取消，不做任何处理
    }).then(responseData=>{
      if(handleData(token, true)) {
        console.log('user cancel');
        return;
      }
      if (!responseData || !responseData.items || responseData.items.length === 0) {
        dispatch({type: Types.SEARCH_FAIL, message: `没有找到关于 ${inputKey}的项目`});
        doCallBack(callBack, `没有找到关于 ${inputKey}的项目`);
        return;
      }
      let items = responseData.items;
      handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', {data: items}, pageSize, favoriteDao, {
        showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey),
          inputKey,
      });
    }).catch(e => {
      console.log(e);
      dispatch({type: Types.SEARCH_FAIL, error: e})
    })


  }
}
// 取消一个异步任务
export function onSearchCancel (token) {
  return dispatch =>{
    CANCEL_TOKENS.push(token);
    dispatch({type: Types.SEARCH_CANCEL});
  }

}

// 加载更多
export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => {//模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex
        })
      } else {
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        _projectModels(dataArray.slice(0, max),favoriteDao,data=>{
          dispatch({
            type: Types.SEARCH_LOAD_MORE_SUCCESS,
            pageIndex,
            projectModels: data,
          })
        })
      }
    }, 500)
  }
}

function genFetchUrl(key) {
  return API_URL + key + QUERY_STR;
}

/**
 * 检查指定token是否已经取消
 * @param token
 * @param isRemove
 * @returns {boolean}
 */
function hasCancel(token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
    return true;
  }
  return false;
}

