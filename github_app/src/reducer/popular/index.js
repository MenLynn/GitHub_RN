import Types from '../../action/types';

const defaultState = {};
/**
 * 节点设置结构
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 * 0.state树，横向扩展
 * 1.如何动态的设置store，和动态获取store(难点：store key不固定)；
 * @param state
 * @param action
 * @returns {{theme: (onAction|*|string)}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LOAD_POPULAR_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,//原始数据
          // projectModels: action.projectModels,//此次要展示的数据
          isLoading: false,
          hideLoadingMore: false,
          // pageIndex: action.pageIndex
        }
      };
    case Types.POPULAR_REFRESH://下拉刷新
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        }
      };
    case Types.LOAD_POPULAR_FAIL://下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        }
      };
    default:
      return state;
  }

}
