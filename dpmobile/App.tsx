import React from 'react';
import { StyleSheet, Text, View, StatusBar, ImageProps } from 'react-native';
import { SurveyForm } from './src/components/surveyform';
import { mapping, dark as DarkTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, BottomNavigation, BottomNavigationTab } from 'react-native-ui-kitten';
import { TopNavigationBar } from './src/components/topbar';
import { DynamicStatusBar } from './src/components/dynamicstatusbar';


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
  render() {

    return (
      <ApplicationProvider
        mapping={mapping}
        theme={DarkTheme}>
        <DynamicStatusBar currentTheme={"Eva Dark"}></DynamicStatusBar>
        <TopNavigationBar title={this.state.title} subtitle={this.state.subtitle}></TopNavigationBar>
        <SurveyForm
          setTitle={this.setTitle.bind(this)}
          setSubTitle={this.setSubTitle.bind(this)} />
        <BottomNavigation>
          <BottomNavigationTab
            title='Screen 1'
          />
          <BottomNavigationTab
            title='Screen 2'
          />
          <BottomNavigationTab
            title='Screen 3'
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
