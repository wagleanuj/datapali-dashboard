import { View, AsyncStorage } from "react-native";
import { withStyles, ThemedComponentProps } from "react-native-ui-kitten";
import { Button } from "react-native-paper";
import React from "react";
import { StorageUtil } from "../storageUtil";
import { request } from "dpform";
import { APP_CONFIG } from "../config";

type SettingsProps = {

} & ThemedComponentProps
type SettingsState = {
    isLoadingAvailableForms: boolean,
}
class SettingsComponent extends React.Component<SettingsProps, SettingsState>{
    constructor(props: SettingsProps) {
        super(props);

        this.state = {
            isLoadingAvailableForms: false,
        }
    }
    private async handleLogout() {
        await AsyncStorage.clear();
        this.props.navigation.navigate("LoginPage");
    }
    private async handleLoadAvailableForms() {
        this.setState({
            isLoadingAvailableForms: true
        })
        let authToken = await StorageUtil.getAuthToken();
        const requestBody = {
            query: `
              query Forms{
                  forms{
                      id
                      name
                      content
                  }
                }`,
            variables: {

            },
        };
        let result = await request(APP_CONFIG.localServerURL, "forms", requestBody, "Could not fetch available forms, try again", authToken);
        let toStore = { availableForms: [] };
        result.forEach(item => {
            toStore.availableForms.push(item.id);
            toStore[item.id] = item;
        })
        await StorageUtil.multiSet(toStore);
        this.setState({
            isLoadingAvailableForms: false,
        })

    }
    render() {
        return (<View style={this.props.themedStyle.container}>
            <Button mode="contained" disabled={this.state.isLoadingAvailableForms} loading={this.state.isLoadingAvailableForms} onPress={this.handleLoadAvailableForms.bind(this)} style={this.props.themedStyle.button}>Load Available Forms</Button>
            <Button mode="contained" onPress={this.handleLogout.bind(this)} style={this.props.themedStyle.button}>Logout</Button>

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