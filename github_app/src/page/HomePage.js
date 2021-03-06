import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import {NavigationActions} from 'react-navigation';
import {connect} from "react-redux";
import BackPressComponent from "../common/BackPressComponent";
import CustomTheme from "./CustomTheme";
import actions from "../action";

type Props = {};
class HomePage extends Component<Props> {
  constructor(props) {
    super(props);
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
    this.props = props;
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
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
  renderCustomThemeView() {
    const {customThemeViewVisible, onShowCustomThemeView} = this.props;
    return (<CustomTheme
      visible={customThemeViewVisible}
      {...this.props}
      onClose={() => onShowCustomThemeView(false)}
    />)
  }
  render() {
    NavigationUtil.navigation = this.props.navigation; // 解决多层嵌套无法跳转
    return <View style={{flex: 1}}>
      <DynamicTabNavigator/>
      {this.renderCustomThemeView()}
    </View>
  }
}

// 订阅state
const mapStateToProps = state => ({
  nav: state.nav,
  customThemeViewVisible: state.theme.customThemeViewVisible,
  // theme: state.theme.theme,
});

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

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
