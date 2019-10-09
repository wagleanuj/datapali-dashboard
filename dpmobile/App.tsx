import { mapping } from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApplicationProvider, IconRegistry } from 'react-native-ui-kitten';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ApplicationLoader } from './src/appLoader/applicationLoader.component';
import { DynamicStatusBar } from './src/components/dynamicstatusbar.component';
import { Router } from './src/navigation/routes';
import { Helper } from './src/redux/helper';
import { rootReducer } from './src/redux/reducers/rootReducer';
import { ThemeContext, ThemeContextType, ThemeKey, themes, ThemeStore } from './src/themes';

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
  store: any,
  isLoading: boolean,
}



export default class App extends React.Component<AppProps, AppState> {
  store: any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      signedIn: false,
      theme: 'Eva Dark',
      store: createStore(rootReducer),
      isLoading: true,
    }
  }


  async componentDidMount() {
    // await AsyncStorage.clear();
    const theme = await AsyncStorage.getItem("theme");
    const appstate = await Helper.generateAppState();
    this.store = createStore(rootReducer, appstate);
    if (theme) {
      this.setState({
        theme: theme as ThemeKey,
        // store: store
      })
    }
    this.setState({
      isLoading: false
    })

  }

  private onSwitchTheme = (theme: ThemeKey) => {
    ThemeStore.setTheme(theme).then(() => {
      this.setState({ theme });
    });
  };
  onNavigationStateChange(prevState, newState) {
  }

  render() {
    const contextValue: ThemeContextType = {
      currentTheme: this.state.theme,
      toggleTheme: this.onSwitchTheme,
    };

    return (
      <ApplicationLoader assets={{ fonts: fonts, images: [] }}>
        {!this.state.isLoading && <Provider store={this.store}>
          <ThemeContext.Provider value={contextValue}>
            <ApplicationProvider
              mapping={mapping}
              theme={themes[this.state.theme]}>
              <IconRegistry icons={EvaIconsPack} />
              <DynamicStatusBar currentTheme={this.state.theme} />
              <Router onNavigationStateChange={this.onNavigationStateChange.bind(this)} />
            </ApplicationProvider>
          </ThemeContext.Provider>
        </Provider>}
      </ApplicationLoader>

    );
  }
}