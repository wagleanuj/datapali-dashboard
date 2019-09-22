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
import { MenuNavigationOptions } from './options';
import { Settings } from '../components/settings';

const FormListNavigator: NavigationContainer = createStackNavigator({
  ["FormView"]: FormList,
  ["SurveyForm"]: SurveyForm
}
);
const SettingsNavigator: NavigationContainer = createStackNavigator({
  ["Setting"]: Settings,
}, {
  headerMode: 'screen',
  defaultNavigationOptions: MenuNavigationOptions,
});

const MenuNavigator: NavigationContainer = createBottomTabNavigator({
  ['Forms']: FormListNavigator,
  ['Settings']: SettingsNavigator,
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
  defaultNavigationOptions: MenuNavigationOptions,
});

const RootNavigator = (signedIn: boolean = false): NavigationContainer => createSwitchNavigator({
  Home: { screen: MenuNavigator },
  LoginPage: { screen: LoginNavigator },
}, {
  initialRouteName: signedIn ? "Home" : "LoginPage",
})


const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};


export const Router = (isSignedIn: boolean = false): NavigationContainer => createAppRouter(RootNavigator(isSignedIn));
