import { ApolloConsumer } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import React from 'react';
import { ToastAndroid } from 'react-native';
import { Appbar } from 'react-native-paper';
import { NavigationScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { AppbarStyled } from '../components/Appbar.component';
import { APP_CONFIG } from '../config';
import { handleLogout, handleSetRootForms, handleTogglePagerMode, handleSetTheme } from '../redux/actions/action';
import { persistor } from '../redux/configureStore';
import { Helper } from '../redux/helper';
import { getUserToken } from '../redux/selectors/authSelector';
import { getPagerModeStatus, getCurrentTheme } from '../redux/selectors/settingsSelector';
import { ThemeContext, ThemeKey } from '../themes';
import { Settings } from './settings.component';
import { Dispatch, Action } from 'redux';
import { DAppState } from '../redux/actions/types';

const DOWNLOAD = gql`  query Forms{
  forms{
      id
      name
      content
  }
}`;
type SettingsProps = {
  pagerModeEnabled: boolean;
  handleLogout: () => void;
  handleTogglePagerMode: () => void;
  handleSetRootForms: (rf: any) => void;
  authToken: string;
  currentTheme: ThemeKey;
  handleSetTheme: (theme: ThemeKey) => void;

} & NavigationScreenProps;
interface State {
  isLoadingAvailableForms: boolean;
}
const routeName = "Settings";
export class SettingsContainer extends React.Component<SettingsProps, State> {
  static navigationOptions = {
    header: (props) => {

      return <AppbarStyled>
        <Appbar.Content
          subtitle={routeName}
          title={"Datapali"}
          titleStyle={{ textAlign: "center", fontSize: 16 }}
          subtitleStyle={{ textAlign: "center", }}
        />
      </AppbarStyled>
    },

  }
  public state: State = {
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
    this.props.handleSetTheme(newTheme);
    
  };
  private onPagerModeToggle = () => {
    this.props.handleTogglePagerMode();
  }
  public render(): React.ReactNode {
    return (
      <ApolloConsumer>
        {client => {
          return (
            <Settings
              pagerModeEnabled={this.props.pagerModeEnabled}
              onTogglePagerMode={this.onPagerModeToggle}
              darkModeEnabled={this.props.currentTheme === "Eva Dark"}
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
const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    handleLogout: () => dispatch(handleLogout()),
    handleSetRootForms: (rf: any) => dispatch(handleSetRootForms(rf)),
    handleTogglePagerMode: () => dispatch(handleTogglePagerMode()),
    handleSetTheme: (theme: ThemeKey) => dispatch(handleSetTheme(theme)),
  }
}
const mapStateToProps = (state: DAppState, props: SettingsProps) => {
  return {
    pagerModeEnabled: getPagerModeStatus(state, props),
    authToken: getUserToken(state, props),
    currentTheme: getCurrentTheme(state, props),
  }
}
export const ConnectedSettings = connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
