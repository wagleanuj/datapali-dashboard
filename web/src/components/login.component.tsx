import { ApolloConsumer } from '@apollo/react-hooks';
import { Button, Card, FormGroup, InputGroup, Intent, Tooltip } from '@blueprintjs/core';
import React from "react";
import { Field, InjectedFormProps, WrappedFieldProps } from 'redux-form';


type Value = {
    email: string;
    password: string;
}
type Props = {
    customSubmit?: (values:Value)=>void;
};

type LoginState = {
    showPassword: boolean;
    hasError: boolean;

}
export type LoginProps = InjectedFormProps<Value, Props> & Props;

export class LoginComponent extends React.Component<LoginProps, LoginState>{
    state = {
        showPassword: false,
        hasError: false,

    }

    handleLockClick = () => {
        this.setState(prevState => {
            return {
                showPassword: !prevState.showPassword
            }
        })
    }

    handleSubmit = (e:any) => {
        const { handleSubmit, customSubmit } = this.props;
        if (customSubmit) handleSubmit(customSubmit)();
        e.preventDefault();
    }

    get LockButton() {
        return (
            <Tooltip
                content={`${this.state.showPassword ? "Hide" : "Show"} Password`}>
                <Button
                    icon={this.state.showPassword ? "eye-open" : "eye-off"}
                    intent={Intent.WARNING}
                    minimal
                    tabIndex={99}
                    onClick={this.handleLockClick}
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
            <InputGroup
                tabIndex={1}
                large
                placeholder="Email address"
                leftIcon={'user'}
                {...props.input}
            />
        )
    }
    renderPasswordInput = (props:WrappedFieldProps) => {
        return (
            <InputGroup
                tabIndex={2}
                large
                placeholder="Password"
                type={this.state.showPassword ? "text" : "password"}
                rightElement={this.LockButton}
                leftIcon={"lock"}
                {...props.input}
            />
        )
    }

    render() {
        return (
            <ApolloConsumer>
                {client => {
                    return (
                        <Card>
                            <h5>Login</h5>
                            <form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Field
                                        name="email"
                                        type="text"
                                        component={this.renderEmailInput}
                                    />

                                </FormGroup>
                                <FormGroup>
                                    <Field
                                        name="password"
                                        type="password"
                                        component={this.renderPasswordInput}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        tabIndex={3}
                                        type="submit"
                                        large
                                        fill
                                    >
                                        Login
                         </Button>
                                </FormGroup>
                                {this.state.hasError && <span className={'error'}>Incorrect email or password</span>}
                            </form>

                        </Card>
                    )
                }}
            </ApolloConsumer>

        )
    }
}

