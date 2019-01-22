import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil';

/**
 * 获取最热数据的异步action
 * @type   storeName
 * pageSize
 */
export function onRefreshTrending(storeName, url, pageSize) {
  return dispatch => {
    dispatch({
      type: Types.TRENDING_REFRESH,
      storeName
    });
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // 异步action与数据流
      .then(data => {
        handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: Types.TRENDING_REFRESH_FAIL,
          storeName,
          error
        })
      })
  }
}

/**
 * 加载更多
 * storeName
 * pageIndex 第几页
 * pageSize
 * dataArray 原始数据
 * callBack 回调函数
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], callBack) {
  return dispatch => {
    setTimeout(() => {  // 模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) { // 加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          storeName,
          error: 'no more',
          pageIndex: --pageIndex,
          projectModels: dataArray
        })
      } else {
        // 本次和载入的最大数据
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        dispatch({
          type: Types.TRENDING_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModels: dataArray.slice(0, max)
        })
      }
    })
  }
}
