import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import DataStore from '../expand/dao/DataStore';

type Props = {};
export default class DataStoreDemoPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      showText: ''
    };
    this.dataStore = new DataStore()
  }
  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.value}`;
    this.dataStore.fetchData(url)
      .then(data => {
        let showData = `初次数据：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
        this.setState({
          showText: showData
        })
      })
      .catch(error => {
        error && console.log(error.toString())
      })
  }
  render() {
    const {tabLabel} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>离线缓存框架设计</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => {
            this.value = text
          }}
        />
        <View>
          <Text onPress={() => {
            this.loadData()
          }}>获取</Text>
          <Text>{this.state.showText}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    height: 35,
    marginVertical: 10
  }
});
