import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Modal, TouchableOpacity, DeviceInfo} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../model/TimeSpan';

export const TimeSpans = [
  new TimeSpan('今 天', 'since=daily'),
  new TimeSpan('本 周', 'since=weekly'),
  new TimeSpan('本 月', 'since=monthly')
];

export default class TrendingDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }
  show() {
    this.setState({
      visible: true
    })
  }
  dismiss() {
    this.setState({
      visible: false
    })
  }
  render() {
    const {onClose, onSelect} = this.props;
    return (
      <Modal
        transparent={true}
        visible={this.state.visible}
        onRequestClose={() => onClose}
      >
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.dismiss()}>
          <MaterialIcons name={'arrow-drop-up'} size={36} style={styles.arrow}/>
          <View style={styles.content}>
            {TimeSpans.map((result, i, arr) => {
              return <TouchableOpacity
                key={i}
                onPress={() => onSelect(arr[i])}
                underlayColor={'transparent'}>
                <View style={styles.text_container}>
                  <Text style={styles.text}>{arr[i].showText}</Text>
                </View>
                {
                  i !== TimeSpans.length - 1 ? <View style={styles.line}/> : null
                }
              </TouchableOpacity>
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .6)',
    paddingTop: DeviceInfo.isIPhoneX_deprecated ? 50 : 0
  },
  arrow: {
    marginTop: 40,
    color: '#fff',
    padding: 0,
    margin: -15
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingVertical: 3,
    marginRight: 5
  },
  text_container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '400',
    paddingVertical: 8,
    paddingHorizontal: 25
  },
  line: {
    height: 0.3,
    backgroundColor: '#ddd'
  }
});
