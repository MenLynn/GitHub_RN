import React, {Component} from 'react';
import {
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';
import {StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator, DeviceInfo} from 'react-native';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import TrendingItem from "../common/TrendingItem";
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from "../navigator/NavigationUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";

const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};
export default class FavoritePage extends Component<Props> {
  constructor(props) {
    super(props);
    this.tabNames = ['最热', '趋势']
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    };
    let navigationBar = <NavigationBar
      title={'收藏'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR,}}
    />;

    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
      'Popular': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,  // 传递参数的写法
        navigationOptions: {
          title: '最热'
        }
      },
      'Trending': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,  // 传递参数的写法
        navigationOptions: {
          title: '趋势'
        }
      }
      }, {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, // 是否使标签大写，默认true
          scrollEnabled: false, // 是否支持 选项卡滚动，默认false
          style: {
            backgroundColor: '#678',
            height: 30
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
          labelStyle: styles.labelStyle,  // 文字的样式
        }
      }
    ));
    return <View style={[styles.container, {marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}]}>
      {navigationBar}
      <TabNavigator />
    </View>;
  }
}

class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }
  componentDidMount() {
    this.loadData(true);
  }
  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading)
  }
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 展示的数据
      }
    }
    return store;
  }
  renderItem(data) {
    // console.log(this.storeName);
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item
      projectModel={item}
      onSelect={(callback) => {  // callback详情点击收藏时改变当前对应的列表的收藏状态
        NavigationUtil.goPage({
          projectModel: item,
          flag: this.storeName,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, this.storeName)}
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
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => "" + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              tintColor={THEME_COLOR}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}/>
          }
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
  favorite: state.favorite
});
const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading))
});

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
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
