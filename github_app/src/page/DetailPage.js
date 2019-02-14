import React, {Component} from 'react';
import {DeviceInfo, Platform, StyleSheet, Text, TouchableOpacity, View, WebView} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";

const THEME_COLOR = '#678';
const TRENDING_URL = 'https://github.com/';

type Props = {};
export default class DetailPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params;
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.favoriteDao = new FavoriteDao(flag);
    this.state = {
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite
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
  onFavoriteButtonClick() {
    const {projectModel, callback} = this.params;
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
    callback(isFavorite);
    this.setState({
      isFavorite: isFavorite
    });
    let key = projectModel.fullName ? projectModel.fullName : projectModel.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }
  renderRightButton() {
    return (<View style={{flexDirection: 'row',alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => this.onFavoriteButtonClick()}
      >
        <FontAwesome
          name={this.state.isFavorite ? 'star' : 'star-o'}
          size={20}
          style={{color: '#fff',marginRight: 5}}/>
      </TouchableOpacity>
      {
        ViewUtil.getShareButton(() => {})
      }
    </View>)
  }
  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url
    })
  }
  render() {
    const {theme} = this.params;
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
    let navigationBar =
      <NavigationBar
        title={this.state.title}
        style={theme.styles.navBar}
        titleLayoutStyle={titleLayoutStyle}
        leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
        rightButton={this.renderRightButton()}
      />;
    return (
      <View style={[styles.container, {marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}]}>
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
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
