import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

/**
 * 获取最热数据的异步action
 * @type   storeName
 * pageSize
 */
export function onRefreshPopular(storeName, url, pageSize) {
  return dispatch => {
    dispatch({
      type: Types.POPULAR_REFRESH,
      storeName
    });
    let dataStore = new DataStore();
    dataStore.fetchData(url) // 异步action与数据流
      .then(data => {
        handleData(dispatch, storeName, data, pageSize)
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
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
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], callBack) {
  return dispatch => {
    setTimeout(() => {  // 模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) { // 加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          storeName,
          error: 'no more',
          pageIndex: --pageIndex,
          projectModels: dataArray
        })
      } else {
        // 本次和载入的最大数据
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        dispatch({
          type: Types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModels: dataArray.slice(0, max)
        })
      }
    })
  }
}

function handleData(dispatch, storeName, data, pageSize) {
  let fixItems = [];
  if (data && data.data && data.data.items) {
    fixItems = data.data.items;
  }
  dispatch({
    type: Types.POPULAR_REFRESH_SUCCESS,
    items: fixItems,
    projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次加载的数据
    storeName,
    pageIndex: 1
  })
}
