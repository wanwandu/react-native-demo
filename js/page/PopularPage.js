/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl, ActivityIndicator, TouchableOpacity} from 'react-native';
import Toast from 'react-native-easy-toast'
import {connect} from 'react-redux' // connect 让组件的store做关联
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {
  createMaterialTopTabNavigator,
  createAppContainer
}  from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import { FLAG_STORAGE } from '../expand/dao/DataStore'
import FavoriteUtil from '../util/FavoriteUtil'
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import Ionicons from 'react-native-vector-icons/Ionicons'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};
class PopularPage extends Component<Props> {
  constructor(props){
    super(props);
    const {onLoadLanguage} = this.props;
    onLoadLanguage(FLAG_LANGUAGE.flag_key);
  }
  _genTabs(){
    const tabs={};
    const {keys, theme} = this.props;
    keys.forEach((item, index) => {
      if (item.checked) {
        tabs[`tab${index}`] = {
          screen: props => <PopularTabPage {...props} tabLabel={item.name} theme={theme}/>,
          navigationOptions: {
            title: item.name
          }
        }
      }
    })
    return tabs;
  }
  renderRightButton() {
    const {theme} = this.props;
    return <TouchableOpacity
      onPress={() => {
        NavigationUtil.goPage({theme}, 'SearchPage')
      }}
    >
      <View style={{padding: 5, marginRight: 8}}>
        <Ionicons
          name={'ios-search'}
          size={24}
          style={{
            marginRight: 8,
            alignSelf: 'center',
            color: 'white',
          }}/>
      </View>
    </TouchableOpacity>
  }
  render() {
    const {keys, theme} = this.props;
    let statusBar = {
      backgroundColor: theme.themeColor
    }
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />
    const TabNavigator = keys.length ?  createAppContainer(createMaterialTopTabNavigator(
      this._genTabs(),{
        tabBarOptions:{
          tabStyles:styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style:{
            backgroundColor:theme.themeColor,
            // height: 30,
          },
          indicatorStyle: styles.indicatorStyle, // 标签指示器样式
          labelStyle: styles.labelStyle
        },
        lazy: true
      }
    )) : null;
    return (
      <View style={{flex: 1,marginTop: 40}}>
        {navigationBar}
        {TabNavigator && <TabNavigator/>}
      </View>
    );
  }
}
const mapPopularStateToProps = state => ({
  keys: state.language.keys,
  theme: state.theme.theme,
});
const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flage) => dispatch(actions.onLoadLanguage(flage))
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);

const pageSize = 10;//设为常量，防止修改
class PopularTab extends Component<Props> {
  constructor(props) {
    super (props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
    this.isFavoriteChanged = false;
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = () => {
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
      if (data.to === 0 && this.isFavoriteChanged) {
        console.log('this.loadData---------->')
        this.loadData(null, true);
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  loadData(loadMore, refreshFavorite) {
    const {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
        this.refs.toast.show('没有更多了');
      })
    }else if (refreshFavorite) {
      onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
    }

  }
  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
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
    return URL + key + QUERY_STR;
  }
  renderItem(data) {
    const item = data.item;
    const {theme} = this.props
    return <PopularItem
      projectModel={item}
      theme = {theme}
      onSelect={(callback)=>{
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: FLAG_STORAGE.flag_popular,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite)=> FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
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
    const {theme} = this.props
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
          keyExtractor={item=>""+item.item.id}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={theme.themeColor}
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
  popular: state.popular
});

const mapDispatchToProps = dispatch =>({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao)=> dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callBack)=> dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callBack)),
onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
})

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab)

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
