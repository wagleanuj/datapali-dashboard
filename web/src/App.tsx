import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { DashboardComponent } from './components/dashboard.component';
import { CONFIG } from './config';
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
      <Provider store={store}>
        <ApolloProvider client={client}>
          <div className={`main-wrapper ${this.Theme}`}>
            <DashboardComponent/>
          </div>
        </ApolloProvider>
      </Provider >

    );
  }
}

export default App;
