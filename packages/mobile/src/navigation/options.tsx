import React from 'react';
import { Icon } from 'react-native-ui-kitten';
import { NavigationParams, NavigationScreenProps } from 'react-navigation';
import { MenuContainer } from '../components/menu.container';
import { TopNavigationBar } from './components/topNavigationBar.component';
import { KEY_NAVIGATION_BACK } from './constants';
import { getCurrentRouteIndex, getCurrentRouteState } from './util';


export type TopNavigationElement = React.ReactElement<any>;
export type BottomNavigationElement = React.ReactElement<any>;

export interface TopNavigationParams extends NavigationParams {
  header: (props: NavigationScreenProps) => TopNavigationElement | null;
}

export interface BottomNavigationParams extends NavigationParams {
  bottomNavigation: (props: NavigationScreenProps) => BottomNavigationElement | null;
}

const MenuTopNavigationParams: TopNavigationParams = {
  header: (props: NavigationScreenProps): TopNavigationElement => {
    // @ts-ignore (private API)
    const { routeName } = getCurrentRouteState(props.navigation);
    const index: number = getCurrentRouteIndex(props.navigation);

    return (
      <TopNavigationBar
        {...props}
        title={routeName}
        backIcon={()=> <Icon name="plus"/>}
        onBackPress={() => {
          props.navigation.goBack(KEY_NAVIGATION_BACK);
        }}
      />
    );
  },
};


const MenuBottomNavigationParams: BottomNavigationParams = {
  bottomNavigation: (props: NavigationScreenProps): BottomNavigationElement => {
    return (
      <MenuContainer {...props} />
    );
  },
};

export const MenuNavigationOptions: NavigationParams = {
  ...MenuTopNavigationParams,
  ...MenuBottomNavigationParams,
};
