import React, {Component} from 'react';
import {
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';
import {StyleSheet, Text, View, Button, FlatList, RefreshControl, ActivityIndicator, DeviceInfo} from 'react-native';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import GlobalStyles from "../res/styles/GlobalStyles";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const pageSize = 10;
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};
class PopularPage extends Component<Props> {
  constructor(props) {
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }
  _getTabs() {
    const tabs = {};
    const {keys} = this.props;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          // screen: PopularTab,  // 不传参数的写法
          screen: props => <PopularTabPage {...props} tabLabel={item.name}/>,  // 传递参数的写法
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs;
  }
  render() {
    const {keys} = this.props;
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR,}}
    />;
    // 动态设置top tab
    const TabNavigator = keys.length ? createAppContainer(createMaterialTopTabNavigator(
      this._getTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, // 是否使标签大写，默认true
          scrollEnabled: true, // 是否支持 选项卡滚动，默认false
          style: {
            backgroundColor: '#678',
            height: 30
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
          labelStyle: styles.labelStyle,  // 文字的样式
        },
        lazy: true  // 懒加载，每次只加载一个tab
      }
    )) : null;
    return <View style={[GlobalStyles.root_container, {marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}]}>
      {navigationBar}
      {TabNavigator && <TabNavigator />}
    </View>;
  }
}

const mapPopularStateToProps = state => ({
  keys: state.language.keys
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);



class PopularTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    // 创建监听器
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = data => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data => {
      // 收藏模块中收藏状态改变 并且 tab切换到 最热模块
      if (data.to === 0 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFreshPopularFavorite} = this.props;
    const url = this.getFetchUrl(this.storeName);
    const store = this._store();
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else if (refreshFavorite) {
      onFreshPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }
  }
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 展示的数据
        hideLoadingMore: true
      }
    }
    return store;
  }
  getFetchUrl(key) {
    return URL + key + QUERY_STR;
  }
  renderItem(data) {
    const item = data.item;
    return <PopularItem
      projectModel={item}
      onSelect={(callback) => {  // callback详情点击收藏时改变当前对应的列表的收藏状态
        NavigationUtil.goPage({
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />
  }
  genIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }
  render() {
    let store = this._store();
    return (
      <View style={GlobalStyles.root_container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => "" + item.item.id}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              tintColor={THEME_COLOR}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}/>
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            // 添加延迟 确保onMomentumScrollBegin在此之前执行
            setTimeout(() => {
              if (this.canLoadMore) { // 解决下拉刷新时调用两次的问题
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100)
          }}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
          }}
        />
        <Toast ref={'toast'} position={'center'}/>
      </View>
    );
  }
}

/***
 * 订阅 使用
 * ***/
const mapStateToProps = state => ({
  popular: state.popular
});
const mapDispatchToProps = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFreshPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFreshPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
  tabStyle: {
    // minWidth: 50
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: '#f00',
    margin: 10
  }
});
