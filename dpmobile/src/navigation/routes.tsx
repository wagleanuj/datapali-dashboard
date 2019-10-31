import { useScreens } from 'react-native-screens';
import { createAppContainer, createSwitchNavigator, NavigationContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { FilledFormsList } from '../components/form/forms';
import { ConnectedSubmitPage } from '../components/form/submitPage';
import { Survey } from '../components/form/survey';
import { ConnectedLoginScreen } from '../components/login.component';
import { MenuContainer } from '../components/menu.container';
import { ConnectedSettings } from '../settings/settings.container';
import { MenuNavigationOptions } from './options';


const FormListNavigator: NavigationContainer = createStackNavigator({
  ["FormView"]: FilledFormsList,
  ["SurveyForm"]: Survey,
  ['SubmitView']: ConnectedSubmitPage,
}
);
const SettingsNavigator: NavigationContainer = createStackNavigator({
  ["Settings"]: ConnectedSettings,
}, {
  headerMode: 'screen',
  defaultNavigationOptions: MenuNavigationOptions,
});

const MenuNavigator = createBottomTabNavigator({
  ['Forms']: FormListNavigator,
  ['Settings']: SettingsNavigator,
}, {
  tabBarComponent: MenuContainer,
});


const RootNavigator: NavigationContainer = createSwitchNavigator({
  ['Home']: MenuNavigator,
  ['Auth']: ConnectedLoginScreen,
}, {
  initialRouteName: "Auth",
})


const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};


export const Router: NavigationContainer = createAppRouter(RootNavigator);
