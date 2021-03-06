import React, {Component} from 'react';
import {StyleSheet, View, Linking, Clipboard} from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';
import GlobalStyles from "../../res/styles/GlobalStyles";
import config from "../../res/data/github_app_config";
import ViewUtil from "../../util/ViewUtil";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-easy-toast';

type Props = {};
export default class AboutMePage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.aboutCommon = new AboutCommon({
        ...this.params,
        navigation: this.props.navigation,
        flagAbout: FLAG_ABOUT.flag_about_me,
      }, data => this.setState({...data})
    );
    this.state = {
      data: config,
      showTutorial: true,
      showBlog: false,
      showQQ: false,
      showContact: false
    };
  }
  onClick(tab) {
    if (!tab) return;
    const {theme} = this.params;
    if (tab.url) {
      NavigationUtil.goPage({
        theme,
        title: tab.title,
        url: tab.url
      }, 'WebViewPage');
      return;
    }
    if (tab.account && tab.account.indexOf('@') > -1) {
      const url = 'mailto://' + tab.account;
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
    }
    if (tab.account) {
      // 复制到剪切板
      Clipboard.setString(tab.account);
      this.toast.show(tab.title + tab.account + '已复制到剪切板。');
    }
  }
  _item(data, isShow, key) {
    const {theme} = this.params;
    return ViewUtil.getSettingItem(() => {
      this.setState({
        [key]: !this.state[key]
      })
    }, data.name, theme.themeColor, Ionicons, data.icon, isShow ? 'ios-arrow-up' : 'ios-arrow-down')
  }
  renderItems(dic, isShowAccount) {
    if (!dic) return null;
    const {theme} = this.params;
    let views = [];
    for (let i in dic) {
      let title = isShowAccount ? dic[i].title + ':' + dic[i].account : dic[i].title;
      views.push(
        <View key={i}>
          {ViewUtil.getSettingItem(() => this.onClick(dic[i]), title, theme.themeColor)}
          <View style={GlobalStyles.line}/>
        </View>
      )
    }
    return views;
  }
  render() {
    const content = <View>
      {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutorial, 'showTutorial')}
      <View style={GlobalStyles.line}/>
      {this.state.showTutorial ? this.renderItems(this.state.data.aboutMe.Tutorial.items) : null}

      {this._item(this.state.data.aboutMe.Blog, this.state.showTutorial, 'showBlog')}
      <View style={GlobalStyles.line}/>
      {this.state.showBlog ? this.renderItems(this.state.data.aboutMe.Blog.items) : null}

      {this._item(this.state.data.aboutMe.QQ, this.state.showTutorial, 'showQQ')}
      <View style={GlobalStyles.line}/>
      {this.state.showQQ ? this.renderItems(this.state.data.aboutMe.QQ.items) : null}

      {this._item(this.state.data.aboutMe.Contact, this.state.showTutorial, 'showContact')}
      <View style={GlobalStyles.line}/>
      {this.state.showContact ? this.renderItems(this.state.data.aboutMe.Contact.items) : null}
    </View>;
    return <View style={{flex: 1}}>
      {this.aboutCommon.render(content, this.state.data.author)}
      <Toast ref={toast => this.toast = toast} position={'center'}/>
    </View>
  }
}

const styles = StyleSheet.create({

});
