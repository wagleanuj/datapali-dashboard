import { ApolloConsumer } from '@apollo/react-hooks';
import { Button, Card, Form, Icon, Input, Tooltip } from 'antd';
import ApolloClient from 'apollo-boost';
import React from "react";
import { Field, InjectedFormProps, WrappedFieldProps } from 'redux-form';


type Value = {
    email: string;
    password: string;
}
export type LoginOwnProps = {
    customSubmit?: (client: ApolloClient<any>) => (values: any) => void;
    onLoggedIn?: (token: string) => void;
    authToken?: string;
};

type LoginState = {
    showPassword: boolean;
    hasError: boolean;

}
export type LoginProps = InjectedFormProps<Value, LoginOwnProps> & LoginOwnProps;

export class LoginComponent extends React.Component<LoginProps, LoginState>{
    state = {
        showPassword: false,
        hasError: false,

    }
    componentDidMount() {
        if (!!this.props.authToken) {
            if (this.props.onLoggedIn) this.props.onLoggedIn(this.props.authToken);
        }
    }


    togglePasswordHide = () => {
        this.setState(prevState => {
            return {
                showPassword: !prevState.showPassword
            }
        })
    }

    createSubmitFunction = (client: ApolloClient<any>) => {
        return (e: any) => {
            const { handleSubmit, customSubmit } = this.props;
            if (customSubmit) handleSubmit(customSubmit(client))().then((token: string) => {
                if (this.props.onLoggedIn) this.props.onLoggedIn(token);
            });
            e.preventDefault();
        }
    }

    renderPasswordHideButton() {
        return (
            <Tooltip
                title={`${this.state.showPassword ? "Hide" : "Show"} Password`}>
                <Button
                    icon={this.state.showPassword ? "eye-open" : "eye-off"}
                    tabIndex={99}
                    onClick={this.togglePasswordHide}
                />
            </Tooltip>
        )
    }

    clearErrors = () => {
        if (!this.state.hasError) return;
        this.setState({
            hasError: false,
        })
    }
    renderEmailInput = (props: WrappedFieldProps) => {
        return (
            <Input
                tabIndex={2}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                type={"email"}
                {...props.input}
            />
        )
    }

    renderPasswordInput = (props: WrappedFieldProps) => {
        return (
            <Input
                tabIndex={2}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
                type={this.state.showPassword ? "text" : "password"}
                {...props.input}
            />
        )
    }

    render() {
        return (
            <ApolloConsumer>
                {client => {
                    return (
                        <Card className="login-form">
                            <h5>Login</h5>
                            <form onSubmit={this.createSubmitFunction(client)}>
                                <Form.Item>

                                    <Field
                                        name="email"
                                        type="text"
                                        component={this.renderEmailInput}
                                    />
                                </Form.Item>
                                <Form.Item>

                                    <Field
                                        name="password"
                                        type="password"
                                        component={this.renderPasswordInput}
                                    />
                                </Form.Item>

                                {this.props.error && <strong className={'error'}>Incorrect email or password</strong>}
                                <Form.Item>
                                    <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
                                        Log in
                                    </Button>

                                </Form.Item>

                            </form>

                        </Card >
                    )
                }
                }
            </ApolloConsumer >

        )
    }
}

