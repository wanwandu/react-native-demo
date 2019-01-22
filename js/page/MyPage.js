/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Button, Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
const THEME_COLOR = '#678'

type Props = {};
export default class MyPage extends Component<Props> {
  getRightButton() {
    return <View style= {{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={()=>{}}
      >
        <View style={{padding: 5, marginRight: 8}}>
          <Feather
            name = {'search'}
            size={20}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  getLeftButton(callBack) {
    return <TouchableOpacity
      style={{padding:8, paddingLeft: 12}}
      onPress={callBack}
    >
      <Ionicons
      name={'ios-arrow-back'}
      size={26}
      style={{color: 'white'}}
      />
    </TouchableOpacity>
  }
  render() {
    const {navigation} = this.props;
    let statusBar = {
      backgroundColor: THEME_COLOR
    }
    let navigationBar = <NavigationBar
      title={'我的'}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
      leftButton={this.getLeftButton()}
      rightButton={this.getRightButton()}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
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
    marginTop: 30
  },
});
