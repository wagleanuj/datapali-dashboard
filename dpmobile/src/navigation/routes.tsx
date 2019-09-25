import { useScreens } from 'react-native-screens';
import { createAppContainer, createSwitchNavigator, NavigationContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { FormList } from '../components/forms';
import { SignIn } from '../components/login';
import { MenuContainer } from '../components/menu.container';
import { Settings } from '../components/settings';
import { SurveyForm } from '../components/surveyform';
import { SettingsContainer } from '../settings/settings.container';
import { MenuNavigationOptions } from './options';


const FormListNavigator: NavigationContainer = createStackNavigator({
  ["FormView"]: FormList,
  ["SurveyForm"]: SurveyForm
}
);
const SettingsNavigator: NavigationContainer = createStackNavigator({
  ["Settings"]: SettingsContainer,
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
