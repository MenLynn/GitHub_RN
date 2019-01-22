import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import NavigationBar from "../common/NavigationBar";
import Ionicons from "react-native-vector-icons/Ionicons";

const THEME_COLOR = '#678';

type Props = {};
export default class DetailPage extends Component<Props> {
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
        title={'详情'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
        leftButton={this.getLeftButton()}
      />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <Text style={styles.welcome}>DetailPage!</Text>
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
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
