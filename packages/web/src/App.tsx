import { ConfigProvider } from 'antd';
import ne_NP from 'antd/es/locale/ne_NP';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './App.css';
import { DashboardComponent } from './components/dashboard.component';
import { CONFIG } from './config';
import { persistor, store } from './configureStore';
import { ConnectedApolloProvider } from './containers/apollo.provider';
import { LoginForm } from './containers/login.container';
import { ConnectedProtectedRoute } from './containers/protectedRoute.container';
import { EAppTheme } from './types';


const client = new ApolloClient({
  uri: CONFIG.serverURL

});

type Props = {
  authToken?: string;
}
type State = {
  theme: EAppTheme,
}
class App extends React.Component<Props, State>{

  state = {
    theme: EAppTheme.DARK,
  }

  get Theme() {
    const { theme } = this.state;
    switch (theme) {
      case EAppTheme.DARK:
        return "bp3-dark"
      case EAppTheme.LIGHT:
        return '';
    }
  }

  changeTheme(newTheme: EAppTheme) {
    this.setState({
      theme: newTheme
    })
  }

  render() {
    return (
      <Router>

        <Provider store={store}>
          <PersistGate onBeforeLift={() => console.log(store.getState())} loading={null} persistor={persistor}>
            <ConnectedApolloProvider client={client}>
              <ConfigProvider locale={ne_NP}>
        
                <div className={`main-wrapper ${this.Theme}`}>
                  <Switch>
                    <Route path="/login" render={({ history, location }) => {
                      return <LoginForm onLoggedIn={() => {
                        let { from } = location.state || { from: { pathname: "/" } };
                        history.replace(from);

                      }}
                      />

                    }} />
                    <Route path="/">
                      <ConnectedProtectedRoute component={DashboardComponent} />
                    </Route>

                  </Switch>

                </div>
                <div id="modal-container">
                </div>
              </ConfigProvider>

            </ConnectedApolloProvider>
          </PersistGate>

        </Provider >
      </Router>

    );
  }
}


export default App;
