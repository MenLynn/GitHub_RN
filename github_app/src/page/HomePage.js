import React, {Component} from 'react';
import {BackHandler, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import {NavigationActions} from 'react-navigation';
import actions from "../action";
import {connect} from "react-redux";

type Props = {};
class HomePage extends Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }
  /**
   * Android模式的物理返回键处理
   */
  onBackPress = () => {
    const {dispatch, nav} = this.props;
    // 如果RootNavigator中的MainNavigator的index为0，则不处理
    if (nav.routes[1].index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };
  render() {
    NavigationUtil.navigation = this.props.navigation; // 解决多层嵌套无法跳转
    return <DynamicTabNavigator />
  }
}

// 订阅state
const mapStateToProps = state => ({
  nav: state.nav
});
export default connect(mapStateToProps)(HomePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});