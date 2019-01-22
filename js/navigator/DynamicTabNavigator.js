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
  createBottomTabNavigator,
  createAppContainer
}  from 'react-navigation';
import NavigationUtil from './NavigationUtil';
import {BottomTabBar} from 'react-navigation-tabs';
import {connect} from 'react-redux'

type Props = {};
import PopularPage from '../page/PopularPage' ;
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import TrendingPage from '../page/TrendingPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
const TABS = {
  PopularPage:{
    screen:PopularPage,
    navigationOptions:{
      tabBarLabel:'最热',
      tabBarIcon:({tintColor,focused}) =>(
        <MaterialIcons
          name={'whatshot'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage:{
    screen: TrendingPage,
    navigationOptions:{
      tabBarLabel:'趋势',
      tabBarIcon:({tintColor,focused}) =>(
        <Ionicons
          name={'md-trending-up'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  FavoritePage:{
    screen:FavoritePage,
    navigationOptions:{
      tabBarLabel:'收藏',
      tabBarIcon:({tintColor,focused}) =>(
        <MaterialIcons
          name={'favorite'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  MyPage:{
    screen:MyPage,
    navigationOptions:{
      tabBarLabel:'我的',
      tabBarIcon:({tintColor,focused}) =>(
        <Entypo
          name={'user'}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
}
class DynamicTabNavigator extends Component<Props> {
  // 关闭警告提示
  constructor(props){
    super(props);
    console.disableYellowBox = true ;
  }
  _tabNavigator(){
    if (this.Tabs){
      return this.Tabs;
    }
    const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage};
    PopularPage.navigationOptions.tabBarLabel= '最新'
    return this.Tabs=createAppContainer(createBottomTabNavigator(
      tabs,
      {
        tabBarComponent: props => {
          return <TabBarComponent theme={this.props.theme} {...props}/>
        }
      }
    ))
  }
  render() {
    // NavigationUtil.navigation = this.props.navigation;
    const Tab=this._tabNavigator();
    return (
      <Tab/>
    );
  }
}
class TabBarComponent extends React.Component{
  constructor(props){
    super(props);
    // this.theme = {
    //   tintColor: props.activeTintColor,
    //   updateTime:new Date().getTime(),
    // }
  }
  render(){
    return <BottomTabBar
      {...this.props}
      activeTintColor={this.props.theme}
    />

  }
}

const mapStateToProps = state => ({
  theme: state.theme.theme,
});
export default connect(mapStateToProps)(DynamicTabNavigator);

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
