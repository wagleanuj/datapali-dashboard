import { ApolloConsumer } from '@apollo/react-hooks';
import { Button, Card, FormGroup, InputGroup, Intent, Tooltip } from '@blueprintjs/core';
import React from "react";
import { Field, InjectedFormProps } from 'redux-form';


type Value = {
    email: string;
    password: string;
}
type Props = {
    onSubmit?: (values: Value) => void;
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
        const { handleSubmit, onSubmit } = this.props;
        console.log(onSubmit);
        if (onSubmit) handleSubmit(onSubmit)();
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
    renderEmailInput = () => {
        return (
            <InputGroup
                tabIndex={1}
                large
                intent={Intent.DANGER}
                placeholder="Email address"
                leftIcon={'user'}
            />
        )
    }
    renderPasswordInput = () => {
        return (
            <InputGroup
                tabIndex={2}
                large
                placeholder="Password"
                rightElement={this.LockButton}
                leftIcon={"lock"}
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
                            <form onSubmit={this.props.onSubmit? this.props.handleSubmit(this.props.onSubmit):()=>{}}>
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

