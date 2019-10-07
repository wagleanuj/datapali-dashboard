import { useScreens } from 'react-native-screens';
import { createAppContainer, createSwitchNavigator, NavigationContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { AuthLoading } from '../components/authloading.component';
import { SignIn } from '../components/login.component';
import { MenuContainer } from '../components/menu.container';
import { FilledFormsList } from '../formComponents/forms';
import { Survey } from '../formComponents/survey';
import { SettingsContainer } from '../settings/settings.container';
import { MenuNavigationOptions } from './options';


const FormListNavigator: NavigationContainer = createStackNavigator({
  ["FormView"]: FilledFormsList,
  ["SurveyForm"]: Survey
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
  AuthLoading: AuthLoading,
  Login: SignIn,
}, {
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: null,
  },
})

const RootNavigator: NavigationContainer = createSwitchNavigator({
  Home: { screen: MenuNavigator },
  AuthLoading: { screen: LoginNavigator },
}, {
  initialRouteName: "AuthLoading",
})


const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};


export const Router: NavigationContainer = createAppRouter(RootNavigator);
