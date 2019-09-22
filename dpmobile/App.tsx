import React from 'react';
import { StyleSheet } from 'react-native';
import { mapping, dark as DarkTheme } from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten';
import { DynamicStatusBar } from './src/components/dynamicstatusbar';
import _ from 'lodash';
import { NavigationState } from 'react-navigation';
import { getCurrentStateName } from './src/navigation';
import { Router } from './src/navigation/routes';
import { StorageUtil } from './src/storageUtil';
import { ApplicationLoader } from './src/appLoader/applicationLoader.component';
import { EvaIconsPack } from '@ui-kitten/eva-icons'; 

const fonts: { [key: string]: number } = {
  'opensans-semibold': require('./src/assets/fonts/opensans-semibold.ttf'),
  'opensans-bold': require('./src/assets/fonts/opensans-bold.ttf'),
  'opensans-extrabold': require('./src/assets/fonts/opensans-extra-bold.ttf'),
  'opensans-light': require('./src/assets/fonts/opensans-light.ttf'),
  'opensans-regular': require('./src/assets/fonts/opensans-regular.ttf'),
};

interface AppProps {

}
interface AppState {
  title: string,
  subtitle: string,
  signedIn: boolean,
}



export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      title: "Datapali",
      subtitle: "",
      signedIn: false,
    }
  }
  componentDidMount() {
    StorageUtil.getAuthToken().then(res => {
      if (res) {
        this.setState({
          signedIn: true,

        })
      }
    })
  }

  private onNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
    const prevStateName: string = getCurrentStateName(prevState);
    const currentStateName: string = getCurrentStateName(currentState);
  };
  render() {
    let Router_ = Router(this.state.signedIn);
    return (
      <ApplicationLoader assets={{ fonts: fonts, images: [] }}>
        <ApplicationProvider
          mapping={mapping}
          theme={DarkTheme}>
          <IconRegistry icons={EvaIconsPack} />
          <DynamicStatusBar currentTheme={"Eva Dark"} />
          <Router_ onNavigationStateChange={this.onNavigationStateChange} />
        </ApplicationProvider>
      </ApplicationLoader>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
