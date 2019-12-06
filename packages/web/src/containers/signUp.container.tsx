import { connect } from "react-redux";
import { FormErrors, reduxForm } from "redux-form";
import { SignUpComponent, SignUpOwnProps } from "../components/signup.component";
import { IAppState } from "../types";

export interface ISignUpUser {
    firstName?: string;
    lastName?: string;
    password?: string;
    email?: string;
}
const validate = (values: ISignUpUser) => {
    const errors: FormErrors<ISignUpUser> = {
    }
    if (!values.firstName) {
        errors.firstName = 'Required'
    } else if (values.firstName.length < 2) {
        errors.firstName = 'Must be 2 characters or more'
    }
    if (!values.lastName) {
        errors.lastName = 'Required'
    }
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    return errors
}

const mapStateToProps = (state: IAppState, props: SignUpOwnProps) => {
    return {
        userId: state.user.id
    }
}
export const ConnectedSignUpForm = connect<{ userId: string }, {}, SignUpOwnProps, IAppState>(mapStateToProps, null)(SignUpComponent);

export const SignUpForm = reduxForm<ISignUpUser, SignUpOwnProps>({
    form: "signUpUser",
    validate: validate,
    asyncBlurFields: ["firstName", "lastName", "email", "password"]
})(ConnectedSignUpForm);
