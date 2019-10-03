import { request } from "dpform";
import React from "react";
import { View, ViewProps } from "react-native";
import { Button as Btn } from "react-native-paper";
import { Input, Text, ThemedComponentProps, ThemeType, withStyles } from "react-native-ui-kitten";
import { NavigationScreenProps } from "react-navigation";
import { APP_CONFIG } from "../config";
import { StorageUtil } from "../storageUtil";


interface ComponentProps {
    onLoginPress: (email: string, password: string) => void;
}

export type SignInProps = ThemedComponentProps & ViewProps & ComponentProps & NavigationScreenProps;

interface State {
    email: string | undefined;
    password: string | undefined;
    isLoggingIn: boolean;
    error: { message: string }[]
}

class SignInComponent extends React.Component<SignInProps, State> {

    public state: State = {
        email: undefined,
        password: undefined,
        isLoggingIn: false,
        error: []
    };

    private onLoginPress = () => {
        const requestBody = {
            query: `
              query Login($email: String!, $password: String!){
                  login(email: $email, password: $password){
                    token
                    user{
                        _id
                        firstName
                        lastName
                      availableForms{
                        name
                        id
                        content
                      }
                      filledForms{
                        id
                        startedDate
                        completedDate
                        formId
                        filledBy
                        answerStore
                      }
                    }
                  }
                }`,
            variables: {
                email: this.state.email,
                password: this.state.password
            },
        };
        this.setState({
            isLoggingIn: true
        });
        return request(APP_CONFIG.serverURL, "login", requestBody, "Could not login", undefined).then(result => {
            let toStore = {
                userID: result.user._id,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                authToken: result.token,
                surveyorCode: result.user._id,
                availableForms: result.user.availableForms.map(item => item.id),
                filledForms: result.user.filledForms.map(item => item.id)
            }

            result.user.filledForms.forEach(item => {
                toStore[item.id] = item;
            });

            result.user.availableForms.forEach(item => {
                toStore[item.id] = item;
            });

            return StorageUtil.multiSet(toStore).then(() => {
                this.props.navigation.navigate("Home");
            }).catch(() => {
                this.setState({
                    error: [{ message: "Failed saving the form to local storage" }],
                    isLoggingIn: false,
                })
            })
        }).catch(() => {
            this.setState({
                isLoggingIn: false,
                error: [{ message: "Incorrect email or password!" }]
            })
        });
    }

    private onEmailInputTextChange = (email: string) => {
        this.setState({ email: email, error: [] });
    };

    private onPasswordInputTextChange = (password: string) => {
        this.setState({ password: password, error: [] });
    };

    private isValid = (value: any): boolean => {
        const { email, password } = value;

        return email !== undefined
            && password !== undefined;
    };

    public render(): React.ReactNode {
        const { themedStyle } = this.props;

        return (
            <View style={themedStyle.container}>
                <View style={themedStyle.header}>
                    <Text>Sign in to your surveyor account</Text>
                </View>
                <Input
                    textContentType={'emailAddress'}
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
                <Btn
                    loading={this.state.isLoggingIn}
                    mode="contained"
                    style={themedStyle.loginButton}
                    disabled={!this.isValid(this.state)}
                    onPress={this.onLoginPress}>
                    Login
            </Btn>
                <View style={this.props.themedStyle.errorContainer}>
                    {this.state.error.map((item, i) => <Text key={'error' + i} style={this.props.themedStyle.errorText}>{item.message}</Text>)}
                </View>

            </View>
        );
    }
}

export const SignIn = withStyles(SignInComponent, (theme: ThemeType) => ({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
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
    errorContainer: {
        marginTop: 32,
        flex: 0,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorText: {
        color: 'red'
    }
}));
