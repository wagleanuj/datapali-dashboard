import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SurveyFormComponent } from './src/components/surveyform';

export default function App() {
  return (
    <View style={styles.container}>
      <SurveyFormComponent/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
