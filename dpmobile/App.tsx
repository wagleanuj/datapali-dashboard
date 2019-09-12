import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SurveyFormComponent } from './src/components/surveyform';
import { Appbar, BottomNavigation } from 'react-native-paper';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar  ></StatusBar>
      <Appbar.Header>

      </Appbar.Header>

      <SurveyFormComponent />
      {/* <BottomNavigation renderScene={()=><></>} onIndexChange = {()=>{}} navigationState={{routes: [],index:0}}></BottomNavigation> */}
    </View >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
