import React from 'react';
import {
  View,
  StatusBar,
  ViewProps,
  StatusBarStyle,
  Platform,
} from 'react-native';

import Constants from 'expo-constants';
import { ThemedComponentProps, withStyles, ThemeType } from 'react-native-ui-kitten';
import { ThemeKey } from '../themes';

interface ComponentProps {
  currentTheme: ThemeKey;
}

export type DynamicStatusBarProps = ThemedComponentProps & ViewProps & ComponentProps;

class DynamicStatusBarComponent extends React.Component<DynamicStatusBarProps> {

  private getStatusBarContent = (): StatusBarStyle => {
    if (this.props.currentTheme === 'Eva Light') {
      return 'dark-content';
    } else {
      return 'light-content';
    }
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;

    const androidStatusBarBgColor: string = themedStyle.container.backgroundColor;
    const barStyle: StatusBarStyle = this.getStatusBarContent();

    return (
      <View style={themedStyle.container}>
        <StatusBar
          backgroundColor={androidStatusBarBgColor}
          barStyle={barStyle}
        />
      </View>
    );
  }
}

export const DynamicStatusBar = withStyles(DynamicStatusBarComponent, (theme: ThemeType) => ({
  container: {
    backgroundColor: theme['background-basic-color-1'],
    height: Platform.select({
      ios: Constants.statusBarHeight,
      android: Constants.statusBarHeight,
    }),
  },
}));