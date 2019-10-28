import { ThemedComponentProps, withStyles } from "react-native-ui-kitten";
import { AppbarProps, Appbar } from "react-native-paper";
import React from "react";

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
        backgroundColor: theme['background-basic-color-2']
    }
}))