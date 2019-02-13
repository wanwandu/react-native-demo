import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation'
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'
import AboutMePage from '../page/about/AboutMePage'
import FetchDemoPage from '../page/FetchDemoPage'
import CustomKeyPage from '../page/CustomKeyPage'
import SortKeyPage from '../page/SortKeyPage'
import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage'
import DataStoreDemoPage from '../page/DataStoreDemoPage'
import {connect} from 'react-redux'
import {reduxifyNavigator, createReactNavigationReduxMiddleware} from 'react-navigation-redux-helpers'
// import React from 'react'
export const rootCom = 'Init'

const InitNavigator=createStackNavigator({
  WelcomePage:{
    screen:WelcomePage,
    navigationOptions:{
      header:null,
    }
  }
})
const MainNavigator=createStackNavigator({
  HomePage:{
    screen:HomePage,
    navigationOptions:{
      header:null,
    }
  },
  DetailPage:{
    screen:DetailPage,
    navigationOptions:{
      header:null
    }
  },
  WebViewPage:{
    screen:WebViewPage,
    navigationOptions:{
      header:null
    }
  },
  AboutPage:{
    screen:AboutPage,
    navigationOptions:{
      header:null
    }
  },
  AboutMePage:{
    screen:AboutMePage,
    navigationOptions:{
      header:null
    }
  },
  CustomKeyPage:{
    screen:CustomKeyPage,
    navigationOptions:{
      header:null
    }
  },
  SortKeyPage:{
    screen:SortKeyPage,
    navigationOptions:{
      header:null
    }
  },
  FetchDemoPage:{
    screen:FetchDemoPage,
    navigationOptions:{
      title: 'fdtch'
    }
  },
  AsyncStorageDemoPage:{
    screen:AsyncStorageDemoPage,
    navigationOptions:{
      title: 'AsyncStorageDemo'
    }
  },
  DataStoreDemoPage:{
    screen:DataStoreDemoPage,
    navigationOptions:{
    }
  },
})
export const RootNavigator = createAppContainer(createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator,
  // TabBar: TabBar,
},{
  defaultNavigationOptions:{
    header:null
  }
}));
// 1.初始化react-navigation与redux的中间件
export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);
const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');
const mapStateToProps = state =>({
  state: state.nav
});
export default connect(mapStateToProps)(AppWithNavigationState);

