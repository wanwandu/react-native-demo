/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceInfo, DeviceEventEmitter} from 'react-native';
import Toast from 'react-native-easy-toast'
import {connect} from 'react-redux' // connect 让组件的store做关联
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {
  createMaterialTopTabNavigator,
  createAppContainer
}  from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
const URL = 'https://github.com/trending/';
const THEME_COLOR = '#678'
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'

type Props = {};
export default class TrendingPage extends Component<Props> {
  constructor(props){
    super(props);
    this.tabNames = ['all', 'C', 'C#', 'JavaScript'];
    this.state = {
      timeSpan: TimeSpans[0],
    }
  }
  _genTabs(){
    const tabs={};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item}/>,
        navigationOptions:{
          title: item
        }
      }
    })
    return tabs;
  }
  renderTitleView() {
    return <View>
      <TouchableOpacity
        underlayColor='transparent'
        onPress={() => this.dialog.show()}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: '400'
          }}
          >趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons
            name={'arrow-drop-down'}
            size={22}
            style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    })
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }
  renderTrendingDialog() {
    return <TrendingDialog
      ref={dialog=>this.dialog=dialog}
      onSelect={tab=>this.onSelectTimeSpan(tab)}
    ></TrendingDialog>

  }
  _tabNav() {
    if (!this.tabNav) {
      this.tabNav= createAppContainer(createMaterialTopTabNavigator(
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
    }
    return this.tabNav;
  }
  render() {
    let statusBar = {
      backgroundColor: THEME_COLOR
    }
    let navigationBar = <NavigationBar
      titleView={this.renderTitleView()}
      statusBar={statusBar}
      style={{backgroundColor: THEME_COLOR}}
    />
    const TabNavigator = this._tabNav();
    return (
      <View style={{flex: 1,marginTop: 40}}>
        {navigationBar}
        <TabNavigator/>
        {this.renderTrendingDialog()}
      </View>
    );
  }
}
const pageSize = 10;//设为常量，防止修改
class TrendingTab extends Component<Props> {
  constructor(props) {
    super (props);
    const {tabLabel, timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan
    console.log(999, this.storeName)
  }

  componentDidMount() {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) =>{
      this.timeSpan = timeSpan;
      this.loadData();
    })
  }
  componentWillUnmount(){
    if(this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove()
    }
  }
  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    console.log('url-------->',url)
    if (loadMore) {
      onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
        this.refs.toast.show('没有更多了');
      })
    } else {
      onRefreshTrending(this.storeName, url, pageSize)
    }

  }
  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
        hideLoadingMore: true,//默认隐藏加载更多
      }
    }
    return store;
  }
  genFetchUrl(key) {
    return URL + key + '?' +  this.timeSpan.searchText;
  }
  renderItem(data) {
    const item = data.item;
    return <TrendingItem     l
      item={item}
      onSelect={()=>{
        NavigationUtil.goPage({
          projectModel: item
        }, 'DetailPage')
      }}
    />

  }
  genIndicator() {
    return this._store().hideLoadingMore ? null :
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
        />
        <Text>正在加载更多</Text>
      </View>
  }
  render() {
    let store = this._store();
    if (!store) {
      store = {
        items: [],
        isLoading: false,
      }
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModels}
          renderItem={data=>this.renderItem(data)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={THEME_COLOR}
              colors={[THEME_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={THEME_COLOR}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            console.log('---onEndReached----');
            setTimeout(() => {
              if (this.canLoadMore) {//fix 滚动时两次调用onEndReached https://github.com/facebook/react-native/issues/14015
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true; //fix 初始化时页调用onEndReached的问题
            console.log('---onMomentumScrollBegin-----')
          }}
        />
        <Toast ref={'toast'}
               position={'center'}
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  trending: state.trending
});

const mapDispatchToProps = dispatch =>({
  onRefreshTrending: (storeName, url, pageSize)=> dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callBack)=> dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, callBack))
})

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab)

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
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: 'red',
    margin: 10
  }
});
