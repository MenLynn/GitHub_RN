import React, {Component} from 'react';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {BottomTabBar} from 'react-navigation-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes';
import {connect} from 'react-redux';

import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';

const TABS = { // 配置路由的页面
  PopularPage: {
    screen: PopularPage,
    navigationOptions: {
      tabBarLabel: '最热',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcon
          name={'whatshot'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: '趋势',
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicon
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    }
  },
  FavoritePage: {
    screen: FavoritePage,
    navigationOptions: {
      tabBarLabel: '收藏',
      tabBarIcon: ({tintColor, focused}) => (
        <MaterialIcon
          name={'favorite'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({tintColor, focused}) => (
        <Entypo
          name={'user'}
          size={26}
          style={{color: tintColor}}
        />
      ),
    }
  }
};

type Props = {};
class TabBarComponent extends React.Component{
  constructor(props) {
    super(props);
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime()
    }
  }
  render() {
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme}
    />
  }
}
class DynamicTabNavigator extends Component<Props> {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }
  _tabNavigator() {
    if (this.Tabs) {
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    // 根据需要 定制显示的tab
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
    // PopularPage.navigationOptions.tabBarLabel = '最热'; // 动态配置tab属性
    return this.Tabs = createAppContainer(createBottomTabNavigator(tabs, {
      // tabBarComponent: TabBarComponent // 动态改变tabbar颜色
      tabBarComponent: props => {
        return <TabBarComponent theme={this.props.theme} {...props}/>
      }
    }));
  }
  render() {
    const Tab = this._tabNavigator();
    return <Tab
      // 监听底部tab切换时  路由的变化
      onNavigationStateChange={(prevState, newState, action) => {
        EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
          from: prevState.index,
          to: newState.index
        })
      }}
    />
  }
}

// 订阅reducer
const mapStateToProps = state => ({
  theme: state.theme.theme
});

export default connect(mapStateToProps)(DynamicTabNavigator)
