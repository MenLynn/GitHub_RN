import React, {Component} from 'react';
import {
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';
import {StyleSheet, Text, View, Button, FlatList, RefreshControl, ActivityIndicator, AsyncStorage} from 'react-native';
import Toast from 'react-native-easy-toast';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import NavigationBar from '../common/NavigationBar';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const pageSize = 10;

type Props = {};
export default class PopularPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'Javascript']
  }
  _getTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        // screen: PopularTab,  // 不传参数的写法
        screen: props => <PopularTabPage {...props} tabLabel={item}/>,  // 传递参数的写法
        navigationOptions: {
          title: item
        }
      }
    });
    return tabs;
  }
  render() {
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
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._getTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false, // 是否使标签大写，默认true
          scrollEnabled: true, // 是否支持 选项卡滚动，默认false
          style: {
            backgroundColor: '#678'
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器的样式
          labelStyle: styles.labelStyle,  // 文字的样式
        }
      }
    ));
    return <View style={styles.container}>
      {navigationBar}
      <TabNavigator />
    </View>;
  }
}

class PopularTab extends Component<Props> {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }
  loadData(loadMore) {
    const {onRefreshPopular, onLoadMorePopular} = this.props;
    const url = this.getFetchUrl(this.storeName);
    const store = this._store();
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else {
      onRefreshPopular(this.storeName, url, pageSize)
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
    return <PopularItem item={item} onSelect={() => {}}/>
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
          keyExtractor={item => "" + item.id}
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
  onRefreshPopular: (storeName, url, pageSize) => dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callBack))
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: '#fff'
  },
  labelStyle: {
    fontSize: 13,
    marginVertical: 6
  },
  indicatorContainer: {
    alignItems: 'center'
  },
  indicator: {
    color: '#f00',
    margin: 10
  }
});
