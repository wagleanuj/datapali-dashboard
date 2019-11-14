import { useMutation } from '@apollo/react-hooks';
import { Button, Card, FormGroup, Spinner } from '@blueprintjs/core';
import { FILL, INPUT } from '@blueprintjs/core/lib/esm/common/classes';
import classNames from 'classnames';
import gql from 'graphql-tag';
import React from 'react';
import { Field, InjectedFormProps, SubmissionError } from "redux-form";
import { AppToaster } from '../App';
import { ISignUpUser } from '../containers/signUp.container';

const SIGN_UP = (accountType: "surveyor" | "admin") => gql`mutation(
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $createdBy: String!
  ) {
    register(
      user: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        password: $password
        accountType: ${accountType} 
        createdBy: $createdBy
      }
    ) {
      _id
    }
  }
  `;
export function validateEmail(email: string): boolean {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export type SignUpOwnProps = {
    userId?: string;
    signUpType?: "surveyor" | "admin"
};
const renderField = ({ input, label, type, meta: { touched, error, warning } }) => {
    return (
        <FormGroup label={label}>
            <input autoComplete={"autocomplete_off_hack_xfr4!k"} className={classNames(INPUT, FILL)} {...input} type={type} />
            {touched && ((error && <span style={{ color: "red" }}>{error}</span>) || (warning && <span>{warning}</span>))}
        </FormGroup>
    )
}
type SignUpProps = InjectedFormProps<ISignUpUser, SignUpOwnProps> & SignUpOwnProps;
export function SignUpComponent(props: SignUpProps) {
    const [createUser, errors] = useMutation(SIGN_UP(props.signUpType), { errorPolicy: "none" });

    const { handleSubmit, pristine, reset, submitting } = props
    const signUp = async (values: ISignUpUser) => {

        const submissionData = { ...values, createdBy: props.userId }
        return createUser({ variables: submissionData }).then(res => {
            AppToaster.show({ message: `${submissionData.firstName} has been signed up!`, intent: "success", timeout: 2000, icon: "tick-circle" })
            return true;
        }).catch(err => {
            throw new SubmissionError({
                _error: err.message.split(":")[1]
            })

        });


    }
    
    return (
        <Card>
            {submitting && <Spinner />}
            <form onSubmit={handleSubmit(signUp)}>
                <Field
                    name="firstName"
                    label={"First Name"}
                    type={"text"}
                    component={renderField}
                />
                <Field
                    name="lastName"
                    type={"text"}
                    label="Last Name"
                    component={renderField}
                />

                <Field
                    name="email"
                    component={renderField}
                    type="text"
                    label="Email Address"

                />
                <Field
                    name="password"
                    label="Password"
                    type="password"
                    component={renderField}

                />
                {props.error && <strong className={'error'}>{props.error}</strong>}

                <Button disabled={submitting} type="submit" large fill alignText="center" icon="endorsed">Submit</Button>
            </form>
        </Card >
    )
}
