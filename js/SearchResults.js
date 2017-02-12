'use strict'
import React, { Component } from 'react';
//所有用到的组件，都要在这里进行声明
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  ListView,
  ActivityIndicator,
  TouchableHighlight,
  Image,
  View
} from 'react-native';

var ProperityView = require('./ProperityView');

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  container: {
    marginTop: 60,
  },
  separator: {
  height: 1,
  backgroundColor: "#dddddd",
  },
  price: {
  fontSize: 25,
  fontWeight: 'bold',
  color: '#48BBEC',
  },
  title: {
    fontSize: 20,
    color: '#656565',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10,
  }
})

class SearchResults extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
    this.state = {
      //从上一级页面传递过来
      dataSource: ds.cloneWithRows(this.props.listings)
    };
  }

  rowPressed(propertyGuid){
    var property = this.props.listings.filter(prop=> prop.guid === propertyGuid)[0];
    this.props.navigator.push({
      title: "Properity",
      component: ProperityView,
      passProps: {property: property}
    });
  }

  renderRow(rowData, sectionID, rowID){
    var price = rowData.price_formatted.split(' ')[0];
    return(
      <TouchableHighlight
        onPress={()=> this.rowPressed(rowData.guid)}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{uri: rowData.img_url}}/>
            <View style={styles.textContainer}>
              <Text style={styles.price}>
                {price}
              </Text>
              <Text style={styles.title}
                numberOfLines={2}>{rowData.title}
              </Text>
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        style={styles.container}
        //不写这一句，会出现黄屏警告
        enableEmptySections={true}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
}

module.exports = SearchResults;
