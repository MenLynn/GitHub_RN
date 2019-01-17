import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

type Props = {};
class PopularTab extends Component<Props> {
  render() {
    const {tabLabel} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{tabLabel}</Text>
        <Text onPress={() => {
          NavigationUtil.goPage({
            navigation: this.props.navigation
          }, 'DetailPage')
        }}>跳转到</Text>
        <Button
          title={'离线缓存'}
          onPress={() => {
            NavigationUtil.goPage({
              navigation: this.props.navigation
            }, 'DataStoreDemoPage')
          }} />
      </View>
    );
  }
}
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
        screen: props => <PopularTab {...props} tabLabel={item}/>,  // 传递参数的写法
        navigationOptions: {
          title: item
        }
      }
    });
    return tabs;
  }
  render() {
    // const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
    //   PopularTab1: {
    //     screen: PopularTab,
    //     navigationOptions: {
    //       title: 'Tab1'
    //     }
    //   },
    //   PopularTab2: {
    //     screen: PopularTab,
    //     navigationOptions: {
    //       title: 'Tab2'
    //     }
    //   }
    // }));
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
    return <View style={{flex: 1,marginTop: 30}}>
      <TabNavigator />
    </View>;
  }
}

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
  }
});
