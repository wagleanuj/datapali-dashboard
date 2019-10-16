import { request } from 'dpform';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { TopNavigation } from 'react-native-ui-kitten';
import { NavigationScreenProps } from 'react-navigation';
import { Header } from 'react-navigation-stack';
import { APP_CONFIG } from '../config';
import { StorageUtil } from '../storageUtil';
import { ThemeContext } from '../themes';
import { Settings } from './settings.component';

interface State {
  darkModeEnabled: boolean;
  isLoadingAvailableForms: boolean;
}
const routeName = "Settings";
export class SettingsContainer extends React.Component<NavigationScreenProps, State> {
  static navigationOptions = {
    header: (props) => {

      return <TopNavigation
        style={{ height: Header.HEIGHT }}
        alignment='center'
        title={routeName}
      />
    },

  }
  public state: State = {
    darkModeEnabled: this.context.currentTheme === "Eva Dark",
    isLoadingAvailableForms: false,
  };
  static contextType = ThemeContext;


  private onDownloadFormsPress = async () => {
    this.setState({
      isLoadingAvailableForms: true
    })
    let authToken = await StorageUtil.getAuthToken().catch(err => {
      this.setState({ isLoadingAvailableForms: false })
    });
    const requestBody = {
      query: `
        query Forms{
            forms{
                id
                name
                content
            }
          }`,
      variables: {

      },
    };
    let result = await request(APP_CONFIG.serverURL, "forms", requestBody, "Could not fetch available forms, try again", authToken).catch(err => {
      this.setState({
        isLoadingAvailableForms: false
      })
    });
    let toStore = { availableForms: [] };
    result.forEach(item => {
      toStore.availableForms.push(item.id);
      toStore[item.id] = item;
    })
    await StorageUtil.multiSet(toStore).catch(err => {
      this.setState({
        isLoadingAvailableForms: false
      })
    });
    this.setState({
      isLoadingAvailableForms: false,
    })
  };

  private async onLogoutPress() {
    await AsyncStorage.clear();
    this.props.navigation.navigate("AuthLoading");
  };


  private onDarkModeToggle = (darkModeEnabled: boolean) => {
    const newTheme = darkModeEnabled ? "Eva Dark" : "Eva Light";

    this.context.toggleTheme(newTheme);
    this.setState({
      darkModeEnabled: darkModeEnabled
    })
  };

  public render(): React.ReactNode {
    return (
      <Settings
        darkModeEnabled={this.state.darkModeEnabled}
        onDownloadFormsPress={this.onDownloadFormsPress}
        onLogoutPress={this.onLogoutPress.bind(this)}
        onToggleDarkMode={this.onDarkModeToggle}
        isLoadingAvailableForms={this.state.isLoadingAvailableForms}
      />
    );
  }
}
