import { ApolloConsumer } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";
import React from "react";
import { View, ViewProps } from "react-native";
import { Button as Btn } from "react-native-paper";
import { Input, Text, ThemedComponentProps, ThemeType, withStyles } from "react-native-ui-kitten";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { initialize } from "redux-form";
import { handleSetFilledForms, handleSetRootForms, handleSetUser } from "../redux/actions/action";
import { FilledForm, User } from "../redux/actions/types";
import { Helper } from "../redux/helper";
import { getUserToken } from "../redux/selectors/authSelector";


const LOGIN = gql`query Login($email: String!, $password: String!){
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
  }`;
interface ComponentProps {
    authToken: string;
    onLoginPress: (email: string, password: string) => void;
    setUser: (user: User) => void;
    setFilledForms: (ffs: any) => void;
    setRootForms: (rr: any) => void;
    initializeForm: (formId: string, values: any) => void;
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
        email: 'surveyor@datapalitest.com',
        password: 'admin',
        isLoggingIn: false,
        error: []
    };

    componentDidMount() {
        if (this.props.authToken) {
            this.props.navigation.navigate("Home");
        }
    }

    componentDidUpdate() {
        if (this.props.authToken) {
            this.props.navigation.navigate("Home");
        }
    }

    private onLoginPress = async (client: ApolloClient<object>) => {

        this.setState({
            isLoggingIn: true
        });
        const { data: { login }, errors, loading } = await client.query({
            query: LOGIN,
            variables: {
                email: this.state.email.toLowerCase(),
                password: this.state.password
            }
        });
        if (errors) return this.setState({
            isLoggingIn: false,
            error: [{ message: "Incorrect email or password!" }]
        })
        let user: User = {
            id: login.user._id,
            token: login.token,
            availableForms: login.user.availableForms.map(item => item.id),
            firstName: login.user.firstName,
            lastName: login.user.lastName,
            filledForms: login.user.filledForms.map(item => item.id)

        }
        let rootForms = {};
        login.user.availableForms.forEach(v => {
            if (typeof v.content === "string") v.content = JSON.parse(v.content);
            const tree = Helper.makeTree(v);
            rootForms[v.id] = tree;
        });
        let filledForms = {};//TODO:: later
        login.user.filledForms.forEach(v => {
            if (typeof v.answerStore === 'string') v.content = JSON.parse(v.answerStore);
            filledForms[v.id] = {
                completedDate: parseInt(v.completedDate),
                filledBy: v.filledBy,
                formId: v.formId,
                id: v.id,
                startedDate: parseInt(v.startedDate),
                submitted: true,
            } as FilledForm;
            this.props.initializeForm(v.id, v.answerStore);
        })
        this.props.setRootForms(rootForms);
        this.props.setUser(user);
        this.props.setFilledForms(filledForms);

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
            <ApolloConsumer>
                {client => {
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
                                onPress={() => this.onLoginPress(client)}>
                                Login
                             </Btn>
                            <View style={this.props.themedStyle.errorContainer}>
                                {this.state.error.map((item, i) => <Text key={'error' + i} style={this.props.themedStyle.errorText}>{item.message}</Text>)}
                            </View>

                        </View>
                    )
                }}

            </ApolloConsumer>

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
const mapStateToProps = (state, props) => {
    return {
        authToken: getUserToken(state, props)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        setRootForms: (forms: any) => dispatch(handleSetRootForms(forms)),
        setFilledForms: (forms: any) => dispatch(handleSetFilledForms(forms)),
        setUser: (user: User) => dispatch(handleSetUser(user)),
        initializeForm: (formId: string, formValues: any) => dispatch(initialize(formId, formValues))
    }
}
export const ConnectedLoginScreen = connect(mapStateToProps, mapDispatchToProps)(SignIn);
