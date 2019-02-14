import React, {Component} from 'react';
import {
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, DeviceInfo, DeviceEventEmitter, AsyncStorage} from 'react-native';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import actions from '../action/index';
import TrendingItem from '../common/TrendingItem';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
import GlobalStyles from "../res/styles/GlobalStyles";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import ArrayUtil from "../util/ArrayUtil";

const URL = 'https://github.com/trending/';
const pageSize = 10;
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'; // 事件常量过多时  可单独建立文件
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

type Props = {};
class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      timeSpan: TimeSpans[0]
    };
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_language);

    this.preKeys = [];
  }
  _getTabs() {
    const tabs = {};
    const {keys, theme} = this.props;
    this.preKeys = keys;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          // screen: TrendingTab,  // 不传参数的写法
          screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} theme={theme}/>,  // 传递参数的写法
          navigationOptions: {
            title: item.name
          }
        }
      }
    });
    return tabs;
  }
  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    });
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }
  renderTrendingDialog() {
    return <TrendingDialog
      ref={dialog => this.dialog = dialog}
      onSelect={tab => this.onSelectTimeSpan(tab)}
    />
  }
  renderTitleView() {
    return <View>
      <TouchableOpacity
        underlayColor={'transparent'}
        onPress={() => this.dialog.show()}
      >
        <View style={{flexDirection: 'row',alignItems: 'center'}}>
          <Text style={{fontSize: 18,color: '#fff',fontWeight: '400'}}>趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color: '#fff'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  _tabNav() {
    const {theme} = this.props;
    if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
      this.theme = theme;
      // 动态设置top tab
      this.tabNav = createAppContainer(createMaterialTopTabNavigator(
        this._getTabs(), {
          tabBarOptions: {
            tabStyle: styles.tabStyle,
            upperCaseLabel: false, // 是否使标签大写，默认true
            scrollEnabled: true, // 是否支持 选项卡滚动，默认false
            style: {
              backgroundColor: theme.themeColor,
              height: 30
            },
            indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
            labelStyle: styles.labelStyle,  // 文字的样式
          },
          lazy: true  // 懒加载，每次只加载一个tab
        }
      ));
    }
    return this.tabNav;
  }
  render() {
    const {keys, theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'趋势'}
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: theme.themeColor,}}
    />;
    const TabNavigator = keys.length ? this._tabNav() : null;
    return <View style={[GlobalStyles.root_container, {marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}]}>
      {navigationBar}
      {TabNavigator && <TabNavigator />}
      {this.renderTrendingDialog()}
    </View>;
  }
}

const mapTrendingStateToProps = state => ({
  theme: state.theme.theme,
  keys: state.language.languages
});
const mapTrendingDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});

export default connect(mapTrendingStateToProps, mapTrendingDispatchToProps)(TrendingPage);

class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    // 头部类型切换的监听
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
      this.timeSpan = timeSpan;
      this.loadData();
    });
    // 创建监听器
    EventBus.getInstance().addListener(EventTypes.favorite_changed_trending, this.favoriteChangeListener = data => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data => {
      // 收藏模块中收藏状态改变 并且 tab切换到 趋势模块
      if (data.to === 1 && this.isFavoriteChanged) {
        this.loadData(null, true);
      }
    })
  }
  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove()
    }
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  loadData(loadMore, refreshFavorite) {
    const {onRefreshTrending, onLoadMoreTrending, onFreshTrendingFavorite} = this.props;
    const url = this.getFetchUrl(this.storeName);
    const store = this._store();
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else if (refreshFavorite) {
      onFreshTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
    }
  }
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
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
    return URL + key + '?' + this.timeSpan.searchText;
  }
  renderItem(data) {
    const {theme} = this.props;
    const item = data.item;
    return <TrendingItem
      theme={theme}
      projectModel={item}
      onSelect={(callback) => {
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_trending,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
    const {theme} = this.props;
    let store = this._store();
    return (
      <View style={GlobalStyles.root_container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={(item, index) => "" + index}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              tintColor={theme.themeColor}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}/>
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            // 添加延迟 确保onMomentumScrollBegin在此之前执行
            setTimeout(() => {
              if (this.canLoadMore) { // 解决 滚动时两次调用onEndReached
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
  trending: state.trending
});
const mapDispatchToProps = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
  onFreshTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFreshTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao))
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

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
