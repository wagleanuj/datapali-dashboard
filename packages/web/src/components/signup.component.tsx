import { useMutation } from '@apollo/react-hooks';
import { Button, Card, Form, Input, Spin, message } from 'antd';
import gql from 'graphql-tag';
import React from 'react';
import { Field, InjectedFormProps, SubmissionError } from "redux-form";
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
        <Form.Item>
            <Input placeholder={label} autoComplete={"autocomplete_off_hack_xfr4!k"}  {...input} type={type} />
            {touched && ((error && <span style={{ color: "red", top: 0, bottom: 0 }}>{error}</span>) || (warning && <span>{warning}</span>))}
        </Form.Item>
    )
}
type SignUpProps = InjectedFormProps<ISignUpUser, SignUpOwnProps> & SignUpOwnProps;
export function SignUpComponent(props: SignUpProps) {
    const [createUser, errors] = useMutation(SIGN_UP(props.signUpType), { errorPolicy: "none" });

    const { handleSubmit, pristine, reset, submitting } = props
    const signUp = async (values: ISignUpUser) => {

        const submissionData = { ...values, createdBy: props.userId }
        return createUser({ variables: submissionData }).then(res => {
            message.success(`${submissionData.firstName} has been signed up!`)
            return true;
        }).catch(err => {
            throw new SubmissionError({
                _error: err.message.split(":")[1]
            })
        });
    }

    return (
        <Card>
            {submitting && <Spin />}
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

                <Button style={{ width: '100%' }} disabled={submitting} htmlType="submit" icon="user-add">Submit</Button>
            </form>
        </Card >
    )
}
