import { Button, Card, FormGroup, InputGroup, Intent, Tooltip } from '@blueprintjs/core';
import React from "react";
import { Field, InjectedFormProps, WrappedFieldProps } from 'redux-form';


type Value = {
    email: string;
    password: string;
}
export type LoginOwnProps = {
    customSubmit?: (values: Value) => Promise<void>;
    onLoggedIn?: () => void;
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
            if (this.props.onLoggedIn) this.props.onLoggedIn();
        }
    }


    togglePasswordHide = () => {
        this.setState(prevState => {
            return {
                showPassword: !prevState.showPassword
            }
        })
    }

    handleSubmit = (e: any) => {
        const { handleSubmit, customSubmit } = this.props;
        if (customSubmit) handleSubmit(customSubmit)().then(() => {
            if (this.props.onLoggedIn) this.props.onLoggedIn();
        });
        e.preventDefault();
    }

    renderPasswordHideButton() {
        return (
            <Tooltip
                content={`${this.state.showPassword ? "Hide" : "Show"} Password`}>
                <Button
                    icon={this.state.showPassword ? "eye-open" : "eye-off"}
                    intent={Intent.WARNING}
                    minimal
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
            <InputGroup
                tabIndex={1}
                intent={this.props.error ? Intent.DANGER : Intent.NONE}
                large
                placeholder="Email address"
                leftIcon={'user'}
                {...props.input}
            />
        )
    }

    renderPasswordInput = (props: WrappedFieldProps) => {
        return (
            <InputGroup
                intent={this.props.error ? Intent.DANGER : Intent.NONE}
                tabIndex={2}
                large
                placeholder="Password"
                type={this.state.showPassword ? "text" : "password"}
                rightElement={this.renderPasswordHideButton()}
                leftIcon={"lock"}
                {...props.input}
            />
        )
    }

    render() {
        return (
            <Card className="login-form">
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
                    {this.props.error && <strong className={'error'}>Incorrect email or password</strong>}
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

                </form>

            </Card>
        )
    }
}

