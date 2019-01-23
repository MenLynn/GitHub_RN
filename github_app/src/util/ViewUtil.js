import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";
export default class ViewUtil {
  /** 左侧的返回按钮
   *  callBack
   */
  static getLeftBackButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8,paddingLeft: 12}}
      onPress={callBack}>
      <Ionicons
        name={'ios-arrow-back'}
        size={26}
        style={{color: '#fff'}}/>
    </TouchableOpacity>
  }
  /** 右侧的分享按钮
   *  callBack
   */
  static getShareButton(callBack) {
    return <TouchableOpacity
      style={{padding: 8,paddingLeft: 12}}
      onPress={callBack}>
      <Ionicons
        name={'md-share'}
        size={20}
        style={{color: '#fff',marginRight: 10}}/>
    </TouchableOpacity>
  }
}
