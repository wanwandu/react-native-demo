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

type Props = {};
export default class WebViewPage extends Component<Props> {
  constructor (props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const {title, url} = this.params;
    this.state={
      title: title,
      url: url,
      canGoBack: false,
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
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    })

  }
  render() {
    const {theme} = this.params;
    let navigationBar = <NavigationBar
      title={this.state.title}
      style={theme.styles.navBar}
      leftButton={ViewUtil.getLeftBackButton(()=>this.onBackPress())}
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
