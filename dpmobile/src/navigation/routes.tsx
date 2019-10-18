import { Transition } from 'react-native-reanimated';
import { useScreens } from 'react-native-screens';
import { createAppContainer, NavigationContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { ConnectedLoginScreen } from '../components/login.component';
import { MenuContainer } from '../components/menu.container';
import { FilledFormsList } from '../components/reduxFormComponents/forms';
import { Survey } from '../components/reduxFormComponents/survey';
import { SettingsContainer } from '../settings/settings.container';
import { MenuNavigationOptions } from './options';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';


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

const MenuNavigator = createBottomTabNavigator({
  ['Forms']: FormListNavigator,
  ['Settings']: SettingsNavigator,
}, {
  tabBarComponent: MenuContainer,
});




const RootNavigator: NavigationContainer = createAnimatedSwitchNavigator({
  Home: MenuNavigator,
  Auth: ConnectedLoginScreen,
}, {
  initialRouteName: "Auth",
})


const createAppRouter = (container: NavigationContainer): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};


export const Router: NavigationContainer = createAppRouter(RootNavigator);
