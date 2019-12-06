import { TopNavigationProps, StyleType, TopNavigationActionProps, TopNavigationAction, TopNavigation, withStyles, ThemeType } from "react-native-ui-kitten";
import { ImageProps } from "react-native";
import React from "react";
import { SafeAreaView } from "react-navigation";
import { textStyle } from "../../themes/style";
import { Header } from "react-navigation-stack";

export interface ComponentProps {
  backIcon?: BackIconProp;
  onBackPress?: () => void;
}

export type TopNavigationBarProps = TopNavigationProps & ComponentProps;

type BackIconProp = (style: StyleType) => React.ReactElement<ImageProps>;
type BackButtonElement = React.ReactElement<TopNavigationActionProps>;

class TopNavigationBarComponent extends React.Component<TopNavigationBarProps> {

  private onBackButtonPress = () => {
    if (this.props.onBackPress) {
      this.props.onBackPress();
    }
  };

  private renderBackButton = (source: BackIconProp): BackButtonElement => {
    return (
      <TopNavigationAction
        icon={source}
        onPress={this.onBackButtonPress}
      />
    );
  };

  public render(): React.ReactNode {
    const { themedStyle, title, backIcon } = this.props;

    const leftControlElement: BackButtonElement | null = backIcon ? this.renderBackButton(backIcon) : null;

    return (
      <SafeAreaView style={themedStyle.safeArea}>
        <TopNavigation
          style={{height: Header.HEIGHT}}
          alignment='center'
          title={title}
          titleStyle={textStyle.subtitle}
          subtitleStyle={textStyle.caption1}
          leftControl={leftControlElement}
        />
      </SafeAreaView>
    );
  }
}

export const TopNavigationBar = withStyles(TopNavigationBarComponent, (theme: ThemeType) => ({
  safeArea: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
