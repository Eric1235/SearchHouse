'use strict';
var SearchPage = require('./js/SearchPage');
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  TextInput,
  Image,
  View
} from 'react-native';



class SearchHouse extends Component {

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Property Finder',
          component: SearchPage,
        }}
        />
    );
  }
}

var styles = StyleSheet.create({

  container: {
    flex: 1,
    marginTop: 20,
  }
});

AppRegistry.registerComponent('SearchHouse', () => SearchHouse);
