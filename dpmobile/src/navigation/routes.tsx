import { useScreens } from 'react-native-screens';
import { createAppContainer, createSwitchNavigator, NavigationContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { ConnectedLoginScreen } from '../components/login.component';
import { MenuContainer } from '../components/menu.container';
import { FilledFormsList } from '../components/reduxFormComponents/forms';
import { Survey } from '../components/reduxFormComponents/survey';
import { SettingsContainer, ConnectedSettings } from '../settings/settings.container';
import { MenuNavigationOptions } from './options';
import { SubmitPageContainer } from '../components/reduxFormComponents/submitPage';


const FormListNavigator: NavigationContainer = createStackNavigator({
  ["FormView"]: FilledFormsList,
  ["SurveyForm"]: Survey,
  ['SubmitView']: SubmitPageContainer,
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
