import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import WelcomePage from '../page/WelcomePage';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import WebViewPage from '../page/WebViewPage';
import AboutPage from '../page/about/AboutPage';
import AboutMePage from '../page/about/AboutMePage';

import {connect} from 'react-redux';
import {createReactNavigationReduxMiddleware, reduxifyNavigator} from 'react-navigation-redux-helpers';

export const rootCom = 'Init';  // 设置根路由

//启动引导页
const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null
    }
  }
});

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null
    }
  },
  WebViewPage: {
    screen: WebViewPage,
    navigationOptions: {
      header: null
    }
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      header: null
    }
  },
  AboutMePage: {
    screen: AboutMePage,
    navigationOptions: {
      header: null
    }
  }
});

export const RootNavigator = createAppContainer(createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
}, {
  navigationOptions: {
    header: null
  }
}));

// export default createAppContainer(switchNavigator)

/**
 * 1.初始化react-navigation与redux的中间件
 */
export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);
/**
 * 2.将跟导航器组件传递给 reduxifyNavigator
 */
const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');
/**
 * State到Props的映射关系
 */
const mapStateToProps = state => ({
  state: state.nav,
});
/**
 * 3.链接 React 组件与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState);
