import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {};
export default class WelcomePage extends Component<Props> {
  componentDidMount() {
    this.timer = setTimeout(() => {
      NavigationUtil.resetToHomePage({
        navigation: this.props.navigation
      })
    }, 1000)
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer)
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>GitHub App</Text>
        <AntDesign name={'github'} size={40} style={{color: '#fff',marginTop: 30}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#678',
  },
  welcome: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center'
  }
});
