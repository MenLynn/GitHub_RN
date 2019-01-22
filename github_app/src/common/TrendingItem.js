import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HTMLView from 'react-native-htmlview';

export default class TrendingItem extends Component {
  render() {
    const {item} = this.props;
    if (!item) {
      return null
    }
    let favoriteButton =
      <TouchableOpacity style={{padding: 6}}
                        underlayColor={'transparent'}
                        onPress={() => {}}>
        <FontAwesome name={'star-o'} size={24} style={{color: '#f00'}}/>
      </TouchableOpacity>;
    let description = '<p>' + item.description + '</p>';
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.cellContainer}>
          <Text style={styles.title}>{item.fullName}</Text>
          <HTMLView
            value={description}
            onLinkPress={(url) => {}}
            stylesheet={{
              p: styles.description,
              a: styles.description
            }}
          />
          <Text style={styles.description}>{item.meta}</Text>
          <View style={styles.row}>
            <View style={{flexDirection: 'row',alignItems: 'center'}}>
              <Text>Built By:</Text>
              {item.contributors.map((result, i, arr) => {
                return <Image style={{width: 22,height: 22,marginLeft: 5}}
                              key={i}
                              source={{uri: arr[i]}}/>
              })}
            </View>
            <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
              <Text>Start:</Text>
              <Text>{item.starCount}</Text>
            </View>
            {favoriteButton}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  cellContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 3,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 2,

    // ios
    shadowColor: 'gray',
    shadowOffset: {width: 0.5,height: 0.5},
    shadowOpacity: .4,
    shadowRadius: 1,

    // android
    elevation: 2
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#333'
  },
  description: {
    fontSize: 12,
    marginBottom: 2,
    color: '#757575'
  }
});
