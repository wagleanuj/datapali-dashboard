import React from 'react';
import {
  Menu,
  MenuItemType,
} from 'react-native-ui-kitten';

interface State {
  selectedIndex: number;
}

export class MenuShowcase extends React.Component<any, State> {

  public state: State = {
    selectedIndex: null,
  };

  private data: MenuItemType[] = [
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' },
  ];

  private onSelect = (selectedIndex: number): void => {
    this.setState({ selectedIndex });
  };

  public render(): React.ReactNode {
    return (
      <Menu
        data={this.data}
        selectedItem={this.state.selectedIndex}
        onSelect={this.onSelect}
      />
    );
  }
}