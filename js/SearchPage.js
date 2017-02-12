'use strict';
import React, { Component } from 'react';
//所有用到的组件，都要在这里进行声明
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  View
} from 'react-native';

//require关键字获取到资源
var SearchResults = require('./SearchResults');

//css布局
var styles = StyleSheet.create({
  description: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center',
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    marginBottom: 10,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
});

//成为一个独立的函数，不是类方法
function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};

class SearchPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: '',
    };
  }


  onSearchTextChanged(event){
    console.log('onSearchTextChanged');
    this.setState({searchString: event.nativeEvent.text});
    console.log(this.state.searchString);
  }

  _executeQuery(query) {
    this.setState({isLoading: true});
    //进行网络请求
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error =>
        this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
        }));
  }

  _handleResponse(response) {
    this.setState({isLoading: false, message: ''});

    if(response.application_response_code.substr(0, 1) === '1'){
      this.props.navigator.push({
        title: 'Results',
        index: 1,
        component: SearchResults,
        //传递数据到下一级页面
        passProps: {listings: response.listings}
      });
    }else {
      this.setState({ message: 'Location not recognized; please try again.'})
    }
  }

  onSearchPressed(){
    var query = urlForQueryAndPage('place_name', this.state.searchString,1);
    this._executeQuery(query);
  }

  onLocationPressed(){
    navigator.geolocation.getCurrentPosition(
      location => {
        var search = location.coords.latitude + ',' + location.coords.longitude;
        this.setState({searchString: search});
        var query = urlForQueryAndPage('center_point', search, 1);
        this._executeQuery(query);
      },
      error => {
        this.setState({
          message: 'There was a problem with obtaining your location:' + error
        });
      });
  }

  render() {
    var spinner = this.state.isLoading ?
      (
        <ActivityIndicator
          hidden='true'
          size='large'/>) : (<View/>);
    return (
      <View style={styles.container}>
        <Text style={styles.descrpition}>
          搜索二手房！
        </Text>
        <Text style={styles.descrpition}>
          通过名字，邮编或者你最近的位置查找！
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='输入内容进行查找'/>
          <TouchableHighlight style={styles.button}
            underlayColor='#99d94f'
            onPress={this.onSearchPressed.bind(this)}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.flowRight}>
          <TouchableHighlight style={styles.button}
            onPress={this.onLocationPressed.bind(this)}
            underlayColor='#99d94f'>
            <Text style={styles.buttonText}>Location</Text>
          </TouchableHighlight>
        </View>
        <Image source={require('./image/house.png')}/>
        {spinner}
        <Text style={styles.descrpition}>
          {this.state.message}
        </Text>
      </View>
    );
  }
}
module.exports = SearchPage;
