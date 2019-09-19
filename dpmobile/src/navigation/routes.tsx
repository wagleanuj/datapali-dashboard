import React from 'react';
import { useScreens } from 'react-native-screens';
import {
  createAppContainer,
  NavigationContainer,
  NavigationRouteConfigMap,
} from 'react-navigation';

import {createBottomTabNavigator} from "react-navigation-tabs";
import {createStackNavigator} from "react-navigation-stack";
import { MenuContainer } from '../components/menu.container';
import { SurveyFormComponent } from '../components/surveyform';

const MenuNavigator: NavigationContainer = createBottomTabNavigator({
  ['Forms']: SurveyFormComponent,
}, {
  tabBarComponent: MenuContainer,
});const AppNavigator: NavigationContainer = createStackNavigator({
  ['Home']: MenuNavigator,
 
}, {
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: null,
  },
});

const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};


export const Router: NavigationContainer = createAppRouter(AppNavigator);
