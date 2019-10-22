import { ApolloConsumer } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Toast } from 'native-base';
import React from 'react';
import { TopNavigation } from 'react-native-ui-kitten';
import { NavigationScreenProps } from 'react-navigation';
import { Header } from 'react-navigation-stack';
import { connect } from 'react-redux';
import { APP_CONFIG } from '../config';
import { handleLogout, handleSetRootForms } from '../redux/actions/action';
import { persistor } from '../redux/configureStore';
import { Helper } from '../redux/helper';
import { getUserToken } from '../redux/selectors/authSelector';
import { ThemeContext } from '../themes';
import { Settings } from './settings.component';
import { ToastAndroid } from 'react-native';

const DOWNLOAD = gql`  query Forms{
  forms{
      id
      name
      content
  }
}`;
type SettingsProps = {
  handleLogout: () => void;
  handleSetRootForms: (rf: any) => void;
  authToken: string;

} & NavigationScreenProps;
interface State {
  darkModeEnabled: boolean;
  isLoadingAvailableForms: boolean;
}
const routeName = "Settings";
export class SettingsContainer extends React.Component<SettingsProps, State> {
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


  private onDownloadFormsPress = async (client: ApolloClient<object>) => {
    const cl = new ApolloClient({
      uri: APP_CONFIG.serverURL,
      request: operation => {
        operation.setContext({
          headers: {
            authorization: this.props.authToken,
          },
        });
      },
    });
    this.setState({
      isLoadingAvailableForms: true
    })
    const { data: { forms }, errors, loading } = await cl.query({
      query: DOWNLOAD,
      variables: {

      }
    });
    if (errors) {
      ToastAndroid.show("Could not download", 200);
    } else {
      let rootForms = {};
      forms.forEach(v => {
        if (typeof v.content === "string") v.content = JSON.parse(v.content);
        const tree = Helper.makeTree(v);
        rootForms[v.id] = tree;
      });
      this.props.handleSetRootForms(rootForms);
      ToastAndroid.show(
        "Survey Forms have been downloaded.", 3000
      );
    }

    this.setState({
      isLoadingAvailableForms: false,
    })
  };

  private async onLogoutPress() {
    this.props.handleLogout();
    await persistor.purge();
    this.props.navigation.navigate("Auth");
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
      <ApolloConsumer>
        {client => {
          return (
            <Settings
              darkModeEnabled={this.state.darkModeEnabled}
              onDownloadFormsPress={() => this.onDownloadFormsPress(client)}
              onLogoutPress={this.onLogoutPress.bind(this)}
              onToggleDarkMode={this.onDarkModeToggle}
              isLoadingAvailableForms={this.state.isLoadingAvailableForms}
            />
          )
        }}
      </ApolloConsumer>

    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    handleLogout: () => dispatch(handleLogout()),
    handleSetRootForms: (rf: any) => dispatch(handleSetRootForms(rf))

  }
}
const mapStateToProps = (state, props) => {
  return {
    authToken: getUserToken(state, props)
  }
}
export const ConnectedSettings = connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
