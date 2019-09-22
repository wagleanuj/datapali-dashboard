import { View, AsyncStorage } from "react-native";
import { Button, withStyles, ThemedComponentProps } from "react-native-ui-kitten";
import React from "react";

type SettingsProps = {

} & ThemedComponentProps
type SettingsState = {

}
class SettingsComponent extends React.Component<SettingsProps, SettingsState>{
    constructor(props: SettingsProps) {
        super(props);
        this.state = {

        }
    }
    async handleLogout(){
        await AsyncStorage.clear();
        this.props.navigation.navigate("LoginPage");
    }
    render() {
        return (<View style={this.props.themedStyle.container}>
            <Button  style={this.props.themedStyle.button}>Load Available Forms</Button>
            <Button onPress={this.handleLogout.bind(this)} style={this.props.themedStyle.button}>Logout</Button>

        </View>)
    }
}

export const Settings = withStyles(SettingsComponent, theme => ({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: theme['background-basic-color-2'],
    },
    button: {
        marginTop: 10
    }
}))