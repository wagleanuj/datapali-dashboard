import React from 'react';
import { useScreens } from 'react-native-screens';
import {
  createAppContainer,
  NavigationContainer,
  NavigationRouteConfigMap,
  createSwitchNavigator,
} from 'react-navigation';

import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { MenuContainer } from '../components/menu.container';
import { SurveyForm } from '../components/surveyform';
import { FormList } from '../components/forms';
import { SignIn } from '../components/login';

const MenuNavigator: NavigationContainer = createBottomTabNavigator({
  ['Forms']: FormList,
  ['Settings']: SurveyForm,
}, {
  tabBarComponent: MenuContainer,
});

const LoginNavigator: NavigationContainer = createStackNavigator({
  Login: SignIn,
}, {
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: null,
  },
})

const AppNavigator: NavigationContainer = createStackNavigator({
  ['Home']: MenuNavigator,

}, {
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: null,
  },
});

const RootNavigator = (signedIn: boolean = false): NavigationContainer => createSwitchNavigator({
  Home: { screen: AppNavigator },
  LoginPage: { screen: LoginNavigator },
}, {
  initialRouteName: signedIn ? "Home" : "LoginPage",
})


const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};


export const Router = (isSignedIn: boolean = false): NavigationContainer => createAppRouter(RootNavigator(isSignedIn));
