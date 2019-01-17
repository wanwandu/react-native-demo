/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {
  createMaterialTopTabNavigator,
  createAppContainer
}  from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';

type Props = {};
export default class PopularPage extends Component<Props> {
  constructor(props){
    super(props);
    this.tabNames = ['Jave', 'Android', 'IOS', 'React', 'PHP']
  }
  _genTabs(){
    const tabs={};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <PopularTab {...props} TabLabel={item}/>,
        navigationOptions:{
          title: item
        }
      }
    })
    return tabs;
  }
  render() {
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),{
        tabBarOptions:{
          tabStyles:styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style:{
            backgroundColor:'#678'
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器样式
          labelStyle: styles.labelStyle

        }
      }
    ));
    return (
      <View style={{flex: 1,marginTop: 40}}>
        <TabNavigator/>
      </View>
    );
  }
}
class PopularTab extends Component<Props> {
  render() {
    const {TabLabel} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{TabLabel}</Text>
        <Text onPress={()=>{
          NavigationUtil.goPage({
            navigation:this.props.navigation
          }, 'DetailPage')
        }}>跳转详情页</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabStyle:{
    minWidth: 50,
  },
  indicatorStyle:{
     height:2,
    backgroundColor:'#ffff'
  },
  labelStyle:{
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6

  }
});
