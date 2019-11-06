import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { DashboardComponent } from './components/dashboard.component';
import { CONFIG } from './config';
import { LoginForm } from './containers/login.container';
import { ConnectedProtectedRoute } from './containers/protectedRoute.container';
import { store } from './reducers/rootReducer';
import { EAppTheme } from './types';

export const client = new ApolloClient({
  uri: CONFIG.serverURL
})

type Props = {

}
type State = {
  theme: EAppTheme
}
class App extends React.Component<Props, State>{

  state = {
    theme: EAppTheme.DARK
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
          <ApolloProvider client={client}>
            <div className={`main-wrapper ${this.Theme}`}>
              <Switch>
                <Route path="/login">
                  <LoginForm />
                </Route>
                <Route path="/">
                  <ConnectedProtectedRoute component={DashboardComponent} />
                </Route>
              </Switch>
            </div>
          </ApolloProvider>
        </Provider >
      </Router>

    );
  }
}

export default App;
