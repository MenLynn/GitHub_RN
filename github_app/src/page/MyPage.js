import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';

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
        leftButton={this.getLeftButton()}
        rightButton={this.getRightButton()}
      />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <Text style={styles.welcome}>MyPage!</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
