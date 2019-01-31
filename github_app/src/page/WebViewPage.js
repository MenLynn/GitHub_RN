import React, {Component} from 'react';
import {DeviceInfo, StyleSheet, View, WebView} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import GlobalStyles from "../res/styles/GlobalStyles";

const THEME_COLOR = '#678';

type Props = {};
export default class WebViewPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;

    this.state = {
      title: title,
      url: url,
      canGoBack: false
    };
    // 物理返回键的处理
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
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
    this.onBack();
    return true;
  };
  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }
  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url
    })
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
      hidden: true
    };
    let navigationBar =
      <NavigationBar
        title={this.state.title}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
      />;
    return (
      <View style={[GlobalStyles.root_container, {marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}]}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
