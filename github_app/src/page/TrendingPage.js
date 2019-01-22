import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import NavigationBar from "../common/NavigationBar";

const THEME_COLOR = '#678';

type Props = {};
class TrendingPage extends Component<Props> {
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar =
      <NavigationBar
        title={'趋势'}
        statusBar={statusBar}
        style={{backgroundColor: THEME_COLOR}}
      />;
    return (
      <View style={styles.container}>
        {navigationBar}
        <Text style={styles.welcome}>TrendingPage!</Text>
        <Button
          title='改变主题色'
          onPress={() => {
            this.props.onThemeChange('#f60')
          }}
        />
      </View>
    );
  }
}

// 订阅state
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
});
export default connect(mapStateToProps, mapDispatchToProps)(TrendingPage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
