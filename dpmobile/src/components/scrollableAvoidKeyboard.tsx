import React from 'react';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import { ThemedComponentProps, withStyles, ThemeType } from 'react-native-ui-kitten';

export type ScrollableAvoidKeyboardProps = ThemedComponentProps & KeyboardAwareScrollViewProps;

class ScrollableAvoidKeyboardComponent extends React.Component<ScrollableAvoidKeyboardProps> {

  public render(): React.ReactNode {
    const { style, contentContainerStyle, themedStyle, ...restProps } = this.props;

    return (
      <KeyboardAwareScrollView
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        style={[themedStyle.container, style]}
        contentContainerStyle={[themedStyle.contentContainer, contentContainerStyle]}
        enableOnAndroid={true}
        {...restProps}
      />
    );
  }
}

export const ScrollableAvoidKeyboard = withStyles(ScrollableAvoidKeyboardComponent, (theme: ThemeType) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
}));
