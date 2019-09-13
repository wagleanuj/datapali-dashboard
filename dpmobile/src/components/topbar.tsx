import { StyleType, TopNavigationActionProps, TopNavigationAction, TopNavigation, withStyles, ThemeType, TopNavigationProps } from "react-native-ui-kitten";

import { ImageProps, SafeAreaView } from "react-native";

import React from "react";
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
        const { themedStyle, title, backIcon, subtitle } = this.props;

        const leftControlElement: BackButtonElement | null = backIcon ? this.renderBackButton(backIcon) : null;

        return (
            <SafeAreaView style={themedStyle.safeArea}>
                <TopNavigation
                    alignment='center'
                    title={title}
                    subtitle = {subtitle}
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