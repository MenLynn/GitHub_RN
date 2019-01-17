import {combineReducers} from 'redux';
import {rootCom, RootNavigator} from '../navigator/AppNavigators';
import theme from './theme';

// 1.指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

// 2.创建 navigation reducer
const navReducer = (state = navState, action) => {
  const nexState = RootNavigator.router.getStateForAction(action, state);
  // if nexState为null或未定义，返回state
  return nexState || state;
};

// 3.合并 reducer
const index = combineReducers({
  nav: navReducer,
  theme: theme
});

export default index;
