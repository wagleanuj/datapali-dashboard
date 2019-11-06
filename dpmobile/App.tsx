import { ApolloProvider } from '@apollo/react-hooks';
import { mapping } from '@eva-design/eva';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ConnectedApplicationProvider } from './src/components/application.provider';
import { ApplicationLoader } from './src/components/appLoader/applicationLoader.component';
import { DynamicStatusBar } from './src/components/dynamicstatusbar.component';
import { APP_CONFIG } from './src/config';
import { Router } from './src/navigation/routes';
import { persistor, store } from './src/redux/configureStore';
import { ThemeKey, themes } from './src/themes';

const client = new ApolloClient({
  uri: APP_CONFIG.serverURL
});
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
  signedIn: boolean,
  theme: ThemeKey,
}

// persistor.purge();
export default class App extends React.Component<AppProps, AppState> {
  store: any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      signedIn: false,
      theme: 'Eva Dark',
    }
  }


  async componentDidMount() {
    const theme = await AsyncStorage.getItem("theme");
    if (theme) {
      this.setState({
        theme: theme as ThemeKey,
        // store: store
      })
    }
  }


  onNavigationStateChange(prevState, newState) {
  }



  render() {
    return (
      <Provider store={store}>
        <ApplicationLoader assets={{ fonts: fonts, images: [] }}>
          <ConnectedApplicationProvider
            mapping={mapping}
            theme={themes[this.state.theme]}>
            <DynamicStatusBar />
            <PersistGate onBeforeLift={()=>{

            }} loading={null} persistor={persistor}>
              <ApolloProvider client={client}>
                <Router onNavigationStateChange={this.onNavigationStateChange.bind(this)} />
              </ApolloProvider>
            </PersistGate>
          </ConnectedApplicationProvider>
        </ApplicationLoader>
      </Provider>
    );
  }
}
