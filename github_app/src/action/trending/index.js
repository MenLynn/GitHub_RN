import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil';

/**
 * 获取最热数据的异步action
 * @type   storeName
 * pageSize
 */
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({
      type: Types.TRENDING_REFRESH,
      storeName
    });
    let dataStore = new DataStore();
    dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // 异步action与数据流
      .then(data => {
        handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
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
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
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
          pageIndex: --pageIndex
        })
      } else {
        // 本次和载入的最大数据
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data
          })
        })
      }
    })
  }
}

/**
 * 刷新收藏状态
 * @param storeName
 * @param pageIndex
 * @param pageSize
 * @param dataArray
 * @param favoriteDao
 */
export function onFreshTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
  return dispatch => {
    //本次和载入的最大数量
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, data => {
      dispatch({
        type: Types.FLUSH_TRENDING_FAVORITE,
        storeName,
        pageIndex,
        projectModels: data,
      })
    })
  }
}
