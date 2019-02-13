/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { WebView, StyleSheet, TouchableOpacity, View, DeviceInfo } from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../navigator/NavigationUtil'
import BackPressComponent from '../common/BackPressComponent'
import FavoriteDao from '../expand/dao/FavoriteDao'

const TRENDING_URL = 'https://github.com/';
type Props = {};
export default class DetailPage extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModel, flag} = this.params
    this.favoriteDao = new FavoriteDao(flag)
    this.url = projectModel.item.html_url || TRENDING_URL + projectModel.item.fullName;
    const title = projectModel.item.full_name || projectModel.item.fullName;
    this.state={
      title: title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite
    }
    this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }

  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }

  /**
   * 处理 Android 中的物理返回键
   * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
   * @returns {boolean}
   */
  onBackPress() {
    this.onBack();
    return true;
  }
  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack(); // 通过webView中的goBack()方法来返回历史导航记录的上一级
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }

  }
  onFavoriteButtonClick () {
    const {projectModel,callback} = this.params;
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
    callback(isFavorite); // 更新item的收藏状态
    this.setState({
      isFavorite: isFavorite
    });
    let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
    if (projectModel.isFavorite) {
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }
  renderRightButton () {
    return (<View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => this.onFavoriteButtonClick()}>
          <FontAwesome
            name={this.state.isFavorite ? 'star' : 'star-o'}
            size={20}
            style={{color: 'white', marginRight: 10}}
          />
        </TouchableOpacity>
        {ViewUtil.getShareButton(() => {
          // let shareApp = share.share_app;
          // ShareUtil.shareboard(shareApp.content, shareApp.imgUrl, this.url, shareApp.title, [0, 1, 2, 3, 4, 5, 6], (code, message) => {
          //   console.log("result:" + code + message);
          // });
        })}
      </View>
    )
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })

  }
  render() {
    const {theme} = this.params;
    const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null
    let navigationBar = <NavigationBar
      leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
      title={this.state.title}
      style={theme.styles.navBar}
      rightButton={this.renderRightButton()}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true} // 设置进度条
          onNavigationStateChange={e=> this.onNavigationStateChange(e)}
          source={{ uri:this.state.url}}
        ></WebView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
});
