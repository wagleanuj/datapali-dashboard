import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, ThemedComponentProps, ThemeProvider, ThemeType, withStyles } from 'react-native-ui-kitten';
import { SafeAreaView } from 'react-navigation';
import { themes } from '../themes';

interface ComponentProps {
  selectedIndex: number;
  onTabSelect: (index: number) => void;
}

type Props = ThemedComponentProps & ComponentProps;

class MenuComponent extends React.Component<Props> {

  private onTabSelect = (index: number) => {
    this.props.onTabSelect(index);
  };

  public render(): React.ReactNode {
    const { selectedIndex, themedStyle } = this.props;

    return (
      <SafeAreaView style={themedStyle.safeAreaContainer}>
        <ThemeProvider theme={{ ...this.props.theme, ...themes['App Theme'] }}>
          <BottomNavigation
            appearance='noIndicator'
            selectedIndex={selectedIndex}
            onSelect={this.onTabSelect}>
            <BottomNavigationTab
              title='Filled Forms'
              icon={(style) => (<Icon {...style} name="archive" />)}
            />
            <BottomNavigationTab
              title='Settings'
              icon={(style) => (<Icon {...style} name="settings-2" />)}
            />
          </BottomNavigation>
        </ThemeProvider>
      </SafeAreaView>
    );
  }
}

export const Menu = withStyles(MenuComponent, (theme: ThemeType) => ({
  safeAreaContainer: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
