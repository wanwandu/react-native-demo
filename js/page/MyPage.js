/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native'
import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};
export default class MyPage extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to MyPage!</Text>
        <Text onPress={()=>{
          NavigationUtil.goPage({
            navigation:this.props.navigation
          }, 'DetailPage')
        }}>跳转详情页</Text>
        <Button
          title={'Fetch 使用'}
          onPress={()=>{
            NavigationUtil.goPage({
              navigation:this.props.navigation
            }, 'FetchDemoPage')
          }}>跳转Fetch</Button>
        <Button
          title={'AsyncStorageDemo 使用'}
          onPress={()=>{
            NavigationUtil.goPage({
              navigation:this.props.navigation
            }, 'AsyncStorageDemoPage')
          }}>跳转AsyncStorageDemo</Button>
        <Button
          title={'离线缓存框架'}
          onPress={()=>{
            NavigationUtil.goPage({
              navigation:this.props.navigation
            }, 'DataStoreDemoPage')
          }}>跳转DataStoreDemoPage</Button>
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
});
