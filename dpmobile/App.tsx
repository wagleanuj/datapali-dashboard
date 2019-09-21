import React from 'react';
import { StyleSheet } from 'react-native';
import { mapping, dark as DarkTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import { DynamicStatusBar } from './src/components/dynamicstatusbar';
import _ from 'lodash';
import { NavigationState } from 'react-navigation';
import { getCurrentStateName } from './src/navigation';
import { Router } from './src/navigation/routes';
import { StorageUtil } from './src/storageUtil';


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
      <ApplicationProvider
        mapping={mapping}
        theme={DarkTheme}>
        <DynamicStatusBar currentTheme={"Eva Dark"}></DynamicStatusBar>
        <Router_ onNavigationStateChange={this.onNavigationStateChange} />
      </ApplicationProvider>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
