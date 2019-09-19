import React from 'react';
import { StyleSheet, Text, View, StatusBar, ImageProps } from 'react-native';
import { SurveyForm } from './src/components/surveyform';
import { mapping, dark as DarkTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, BottomNavigation, BottomNavigationTab, Icon, IconProps, Menu, MenuItem } from 'react-native-ui-kitten';
import { TopNavigationBar } from './src/components/topbar';
import { DynamicStatusBar } from './src/components/dynamicstatusbar';
import _ from 'lodash';
import { NavigationState } from 'react-navigation';
import { getCurrentStateName } from './src/navigation';
import { Router } from './src/navigation/routes';


interface AppProps {

}
interface AppState {
  title: string,
  subtitle: string,
}



export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      title: "Datapali",
      subtitle: ""
    }
  }
  setTitle(newTitle: string) {
    this.setState({ title: newTitle })
  }
  setSubTitle(newSub: string) {
    this.setState({ subtitle: newSub })
  }
  private onNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
    const prevStateName: string = getCurrentStateName(prevState);
    const currentStateName: string = getCurrentStateName(currentState);

    
  };
  render() {
    let ipr: IconProps = {
      name: "cog",
    }
    return (
      <ApplicationProvider
        mapping={mapping}
        theme={DarkTheme}>
        <DynamicStatusBar currentTheme={"Eva Dark"}></DynamicStatusBar>
        <TopNavigationBar title={this.state.title} subtitle={this.state.subtitle}></TopNavigationBar>
        <Router onNavigationStateChange={this.onNavigationStateChange}/>

        <SurveyForm
          setTitle={this.setTitle.bind(this)}
          setSubTitle={this.setSubTitle.bind(this)} />
        <BottomNavigation>
          <BottomNavigationTab
            title='Survey Form'
          />
          <BottomNavigationTab
            title='Filled Forms'
          />
          <BottomNavigationTab
            title='Settings'
          />
        </BottomNavigation>
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
