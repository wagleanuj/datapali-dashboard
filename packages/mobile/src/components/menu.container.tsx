import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Menu } from './menu.component';

export class MenuContainer extends React.Component<NavigationScreenProps> {
  

  private navigationKey: string = 'MenuContainer';

  private onTabSelect = (index: number) => {
    const { navigation } = this.props;
    const { [index]: selectedRoute } = navigation.state.routes;

    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: selectedRoute.routeName,
    });
  };

  public render(): React.ReactNode {
    return (
      <Menu
        selectedIndex={this.props.navigation.state.index}
        onTabSelect={this.onTabSelect}
      />
    );
  }
}
