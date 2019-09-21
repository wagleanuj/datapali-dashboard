import { ThemedComponentProps, withStyles, ThemeType, Input, Button, Text } from "react-native-ui-kitten";
import { ViewProps, View } from "react-native";
import React from "react";
import { request } from "dpform";
import { APP_CONFIG } from "../config";
import { StorageUtil } from "../storageUtil";


interface ComponentProps {
    onLoginPress: (email: string, password: string) => void;
}

export type SignInProps = ThemedComponentProps & ViewProps & ComponentProps;

interface State {
    email: string | undefined;
    password: string | undefined;
}

class SignInComponent extends React.Component<SignInProps, State> {

    public state: State = {
        email: undefined,
        password: undefined,
    };

    private onLoginPress = () => {
        const requestBody = {
            query: `
              query Login($email: String!, $password: String!){
                  login(email: $email, password: $password){
                   token
                   user {
                       firstName
                       lastName
                       surveyorCode
                   }
                  }
                }`,
            variables: {
                email: this.state.email,
                password: this.state.password
            },
        };
        return request(APP_CONFIG.localServerURL, "login", requestBody, "Could not login", undefined).then(result => {
            let toStore = {
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                authToken: result.token,
                surveyorCode: result.user.surveyorCode
            }
            return StorageUtil.multiSet(toStore).then(r => {
                this.props.navigation.navigate("Home");
            })
        }).catch(err => console.log(err));
    }

    private onEmailInputTextChange = (email: string) => {
        this.setState({ email: email });
    };

    private onPasswordInputTextChange = (password: string) => {
        this.setState({ password: password });
    };

    private isValid = (value: any): boolean => {
        const { email, password } = value;

        return email !== undefined
            && password !== undefined;
    };

    public render(): React.ReactNode {
        const { style, themedStyle, ...restProps } = this.props;

        return (
            <View style={themedStyle.container}>
                <View style={themedStyle.header}>
                    <Text>Sign in to your surveyor account</Text>
                </View>
                <Input
                    value={this.state.email}
                    placeholder='Email'
                    onChangeText={this.onEmailInputTextChange}
                />
                <Input
                    value={this.state.password}
                    style={themedStyle.passwordInput}
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={this.onPasswordInputTextChange}
                />
                <Button
                    style={themedStyle.loginButton}
                    disabled={!this.isValid(this.state)}
                    onPress={this.onLoginPress}>
                    Login
            </Button>
            </View>
        );
    }
}

export const SignIn = withStyles(SignInComponent, (theme: ThemeType) => ({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 64,
        backgroundColor: theme['background-basic-color-2'],
    },
    header: {
        fontSize: 20,
        paddingVertical: 20,
        justifyContent: "center",
        flex: 0,
        flexDirection: "row"
    },
    passwordInput: {
        marginTop: 16,
    },
    loginButton: {
        marginTop: 20,
        paddingHorizontal: 0,
    },
    loginbuttonText: {
        fontSize: 15,
        color: theme['text-hint-color'],
    },
}));
