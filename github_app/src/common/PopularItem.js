import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class PopularItem extends Component {
  render() {
    const {item} = this.props;
    if (!item || !item.owner) {
      return null
    }
    let favoriteButton =
      <TouchableOpacity style={{padding: 6}}
                        underlayColor={'transparent'}
                        onPress={() => {}}>
        <FontAwesome name={'star-o'} size={24} style={{color: '#f00'}}/>
      </TouchableOpacity>
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.cellContainer}>
          <Text style={styles.title}>{item.full_name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.row}>
            <View style={{flexDirection: 'row',alignItems: 'center'}}>
              <Text>Author:</Text>
              <Image style={{width: 22,height: 22,marginLeft: 5}} source={{uri: item.owner.avatar_url}}/>
            </View>
            <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
              <Text>Start:</Text>
              <Text>{item.stargazers_count}</Text>
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
