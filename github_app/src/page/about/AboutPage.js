import React, {Component} from 'react';
import {StyleSheet, View, Linking} from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';
import {MORE_MENU} from "../../common/MORE_MENU";
import GlobalStyles from "../../res/styles/GlobalStyles";
import config from "../../res/data/github_app_config";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";

type Props = {};
export default class AboutPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about,
      }, data => this.setState({...data})
    );
    this.state = {
      data: config
    };
  }
  onclick(menu) {
    const {theme} = this.params;
    let RouteName, params = {theme};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = 'WebViewPage';
        params.title = '教程';
        params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
        break;
      case MORE_MENU.Feedback:    // 反馈  调用第三方邮箱
        const url = 'mailto://crazycodeboy@gmail.com';
        Linking.canOpenURL(url)
          .then(support => {
            if (!support) {
              console.log('Can\'t handle url: ' + url)
            } else {
              Linking.openURL(url)
            }
          })
          .catch(e => {
            console.log('An Error' + e);
          });
        break;
    }
    if (RouteName) {
      NavigationUtil.goPage(params, RouteName);
    }
  }
  getItem(menu) {
    const {theme} = this.params;
    return ViewUtil.getMenuItem(() => this.onclick(menu), menu, theme.themeColor)
  }
  render() {
    const content = <View>
      {this.getItem(MORE_MENU.Tutorial)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.Feedback)}
    </View>;
    return this.aboutCommon.render(content, this.state.data.app);
  }
}

const styles = StyleSheet.create({

});
