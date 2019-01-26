import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';
import {createAppContainer, createMaterialTopTabNavigator} from "react-navigation";
import {FLAG_STORAGE} from "../expand/dao/DataStore";

const THEME_COLOR = '#678';

type Props = {};
export default class MyPage extends Component<Props> {
  getRightButton() {
    return <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => {}}>
        <View style={{padding: 5,marginRight: 10}}>
          <Feather name={'search'} size={24} style={{color: '#fff'}}/>
        </View>
      </TouchableOpacity>
    </View>
  }
  getLeftButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8,paddingLeft: 12}}
      onPress={callBack}>
      <Ionicons name={'ios-arrow-back'} size={26} style={{color: '#fff'}}/>
    </TouchableOpacity>
  }

  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar =
      <NavigationBar
        title={'我的'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        // leftButton={this.getLeftButton()}
        rightButton={this.getRightButton()}
      />;
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
        'Popular': {
          screen: PopularScreen,  // 传递参数的写法
          navigationOptions: {
            title: '最热'
          }
        },
        'Trending': {
          screen: TrendingScreen,
          navigationOptions: {
            title: '趋势'
          }
        }
      }, {
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
        }
      }
    ));
    return (
      <View style={styles.container}>
        {navigationBar}
        <TabNavigator />
        {/*<Button*/}
          {/*title={'离线缓存'}*/}
          {/*onPress={() => {*/}
            {/*NavigationUtil.goPage({*/}
              {/*navigation: this.props.navigation*/}
            {/*}, 'DataStoreDemoPage')*/}
          {/*}} />*/}
      </View>
    );
  }
}

class PopularScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          主页
        </Text>
      </View>
    );
  }
}
class TrendingScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          设置页面
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
