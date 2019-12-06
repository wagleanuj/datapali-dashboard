import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten';
import { SafeAreaView } from 'react-navigation';

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
      </SafeAreaView>
    );
  }
}

export const Menu = withStyles(MenuComponent, (theme: ThemeType) => ({
  safeAreaContainer: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
