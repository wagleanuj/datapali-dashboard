import React from "react";
import { Appbar, AppbarProps } from "react-native-paper";
import { ThemedComponentProps, withStyles } from "react-native-ui-kitten";

type AppbarProps_ = {

} & ThemedComponentProps & AppbarProps
class Appbar_ extends React.Component<AppbarProps_, {}>{
    render() {
        return (
            <Appbar style={this.props.themedStyle.appbar}>
                {this.props.children}
            </Appbar>
        )
    }
}
export const AppbarStyled = withStyles(Appbar_, theme=>({
    appbar: {
        backgroundColor: theme['background-basic-color-1']
    }
}))