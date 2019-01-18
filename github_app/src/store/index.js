import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';  // 实现异步action
import {middleware} from '../navigator/AppNavigators';

/*
* 自定义中间件 -- 开始
*/
const logger = store => next => action => {
  if (typeof action === 'function') {
    // console.log('dispatching a function')
  } else {
    // console.log('dispatching', action)
  }
  const result = next(action);
  // console.log('nextState', store.getState())
};
/*
* 自定义中间件 -- 结束
*/

const middlewares = [
  middleware,
  logger,
  thunk
];

// 创建store
export default createStore(reducers, applyMiddleware(...middlewares))

