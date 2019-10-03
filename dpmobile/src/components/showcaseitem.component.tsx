import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text, ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten';

interface ComponentProps {
    title: string;
    children: ChildrenProp;
}

type ChildrenProp = React.ReactElement<any>;

export type ShowcaseItemProps = ThemedComponentProps & ViewProps & ComponentProps;

class ShowcaseItemComponent extends React.Component<ShowcaseItemProps> {

    public render(): React.ReactNode {
        const { style, themedStyle, title, children, ...restProps } = this.props;

        return (
            <View
                style={[themedStyle.container, style]}
                {...restProps}>
                <Text
                    style={themedStyle.titleLabel}
                    appearance='hint'
                    category='s2'>
                    {title}
                </Text>
                {children}
            </View>
        );
    }
}

export const ShowcaseItem = withStyles(ShowcaseItemComponent, (theme: ThemeType) => ({
    container: {
        flex: 1,
    },
    titleLabel: {
        minWidth: 128,
    },
}));
