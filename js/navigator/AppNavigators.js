import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation'
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
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
      header:null,
    }
  }
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
export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);
const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');
const mapStateToProps = state =>({
  state: state.nav
});
export default connect(mapStateToProps)(AppWithNavigationState);

