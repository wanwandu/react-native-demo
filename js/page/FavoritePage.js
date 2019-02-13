/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, Button, RefreshControl, ActivityIndicator} from 'react-native';
import Toast from 'react-native-easy-toast'
import {connect} from 'react-redux' // connect 让组件的store做关联
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import TrendingItem from '../common/TrendingItem'
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {
  createMaterialTopTabNavigator,
  createAppContainer
}  from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import { FLAG_STORAGE } from '../expand/dao/DataStore'
import FavoriteUtil from '../util/FavoriteUtil'
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

type Props = {};
class FavoritePage extends Component<Props> {
  constructor(props){
    super(props);
    this.tabNames = ['最热', '趋势']
  }
  render() {
    const {theme} = this.props
    let statusBar = {
      backgroundColor: theme.themeColor
    }
    let navigationBar = <NavigationBar
      title={'最热'}
      statusBar={statusBar}
      style={theme.styles.navBar}
    />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
        'Popular': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
          navigationOptions: {
            title: '最热',
          },
        },
        'Trending': {
          screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme} />,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
          navigationOptions: {
            title: '趋势',
          },
        },
      }, {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,//是否使标签大写，默认为true
          style: {
            backgroundColor: theme.themeColor,//TabBar 的背景颜色
            // height: 50//fix 开启scrollEnabled后再Android上初次加载时闪烁问题
          },
          indicatorStyle: styles.indicatorStyle,//标签指示器的样式
          labelStyle: styles.labelStyle,//文字的样式
        }
      }
    ));
    return (
      <View style={{flex: 1,marginTop: 40}}>
        {navigationBar}
        <TabNavigator/>
      </View>
    );
  }
}
const mapFavoriteStateToProps = state => ({
  theme: state.theme.theme,
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapFavoriteStateToProps)(FavoritePage);
class FavoriteTab extends Component<Props> {
  constructor(props) {
    super (props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag)
  }

  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if (data.to === 2) {
        this.loadData(false);
      }
    })
  }
  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }
  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading)

  }
  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
      }
    }
    return store;
  }
  onFavorite(item, isFavorite) {
    FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
    if (this.storeName === FLAG_STORAGE.flag_popular) {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending);
    }
  }
  renderItem(data) {
    const item = data.item;
    const {theme} = this.props
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem
    return <Item
      projectModel={item}
      theme={theme}
      onSelect={(callback)=>{
        NavigationUtil.goPage({
          theme,
          projectModel: item,
          flag: this.storeName,
          callback
        }, 'DetailPage')
      }}
      onFavorite={(item, isFavorite)=> this.onFavorite(item, isFavorite)}
    />

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
          keyExtractor={item=> "" + (item.item.id || item.item.fullName)}
          refreshControl={
            <RefreshControl
              title={'Loading'}
              titleColor={theme.themeColor}
              colors={[theme.themeColor]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={theme.themeColor}
            />
          }
        />
        <Toast ref={'toast'}
               position={'center'}
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({
  favorite: state.favorite
});

const mapDispatchToProps = dispatch =>({
  onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
})

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
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
    minWidth: 50, //fix minWidth会导致tabStyle初次加载时闪烁
    // padding: 0
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
