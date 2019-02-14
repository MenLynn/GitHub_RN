import React from 'react';
import {Platform, StyleSheet, Text, View, Image, Dimensions, DeviceInfo} from 'react-native';
import ParallaxScrollView from "react-native-parallax-scroll-view";
import BackPressComponent from "../../common/BackPressComponent";
import NavigationUtil from "../../navigator/NavigationUtil";
import github_app_config from "../../res/data/github_app_config";
import GlobalStyles from "../../res/styles/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";



const window = Dimensions.get('window');
const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = (Platform.OS === 'ios') ? 20 + (DeviceInfo.isIPhoneX_deprecated ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + TOP : GlobalStyles.nav_bar_height_android;

export const FLAG_ABOUT = {
  flag_about: 'about',
  flag_about_me: 'about_me'
};

export default class AboutCommon {
  constructor(props, updateState) {
    this.props = props;
    this.updateState = updateState;

    // 2. 本地请求方式
    // this.updateState({
    //   data: github_app_config
    // });

    // 物理返回键的处理
    this.backPress = new BackPressComponent({backPress: this.onBackPress});
  }
  componentDidMount() {
    this.backPress.componentDidMount();
    // 1. 网络请求方式
    fetch('http://www.devio.org/io/GitHubPopular/json/github_app_config.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('NetWork Error');
      })
      .then(config => {
        if (config) {
          this.updateState({
            data: config
          })
        }
      })
      .catch(e => {
        console.log(e);
      })
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  /**
   * Android模式的物理返回键处理
   */
  onBackPress = () => {
    NavigationUtil.goBack(this.props.navigation);
    return true;
  };
  onShare() {}
  getParallaxRenderConfig(params) {
    console.log(params);
    let config = {};
    let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;
    config.renderBackground = () => (
      <View key="background">
        <Image style={{width: window.width, height: PARALLAX_HEADER_HEIGHT,}} source={avatar} />
        <View style={{
          position: 'absolute',
          top: 0,
          width: window.width,
          backgroundColor: 'rgba(0,0,0,.4)',
          height: PARALLAX_HEADER_HEIGHT}}/>
      </View>
    );
    config.renderForeground = () => (
      <View key="parallax-header" style={styles.parallaxHeader}>
        <Image style={styles.avatar}
               source={avatar}/>
        <Text style={styles.sectionSpeakerText}>
          {params.name}
        </Text>
        <Text style={styles.sectionTitleText}>
          {params.description}
        </Text>
      </View>
    );
    config.renderStickyHeader = () => (
      <View key="sticky-header" style={styles.stickySection}>
        <Text style={styles.stickySectionText}>{params.name}</Text>
      </View>
    );
    config.renderFixedHeader = () => (
      <View key="fixed-header" style={styles.fixedSection}>
        {ViewUtil.getLeftBackButton(() => NavigationUtil.goBack(this.props.navigation))}
        {ViewUtil.getShareButton(() => this.onShare())}
      </View>
    );
    return config;
  }
  render(contentView, params) {
    const {theme}=this.props;
    const renderConfig = this.getParallaxRenderConfig(params);
    return (
      <ParallaxScrollView
        backgroundColor={theme.themeColor}
        contentBackgroundColor={GlobalStyles.backgroundColor}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}  // 顶部悬浮的高度
        backgroundScrollSpeed={10}
        {...renderConfig}>
        {contentView}
      </ParallaxScrollView>
    )
  }
}


const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    alignItems: 'center',
    paddingTop:TOP
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop:TOP
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  avatar: {
    marginBottom: 10,
    borderRadius: AVATAR_SIZE / 2
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5,
    marginBottom: 10
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 16,
    marginRight: 10,
    marginLeft: 10
  },
});
