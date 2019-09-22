import { request } from "dpform";
import React from "react";
import { Button, Container, FormGroup, Row } from "reactstrap";
interface LoginProps {
    onLoggedIn: (token: string) => void
}
interface LoginState {

}
export class Login extends React.Component<LoginProps, LoginState>{
    usernameRef?: HTMLInputElement | null;
    passwordRef?: HTMLInputElement | null;
    constructor(props: LoginProps) {
        super(props);
        this.state = {

        }
    }
    handleLogin() {
        const username = this.usernameRef && this.usernameRef.value;
        const password = this.passwordRef && this.passwordRef.value;
        let requestBody = {
            query: `
            query Login($email: String!, $password: String!){
                login(email: $email, password: $password){
                  token
                }
              }`,
            variables: {
                email: username,
                password: password
            }
        }
        return request("http://localhost:5000/graphql", "login", requestBody, "Could not login", "").then(res => {
            console.log(res);
            if (this.props.onLoggedIn) this.props.onLoggedIn(res.token);
        })
    }
    render() {
        return (
            <Container style={{alignContent: "center", margin: "0 auto"}}>
                <Row>
                    <FormGroup>
                        <label> username </label>
                        <input ref={r => this.usernameRef = r} type="text" ></input>

                    </FormGroup>
                </Row>
                <Row>

                    <FormGroup>
                        <label> password </label>
                        <input ref={r => this.passwordRef = r} type="password"></input>
                    </FormGroup>
                </Row>
                <Row>

                    <Button onClick={this.handleLogin.bind(this)}>Submit</Button>
                </Row>
            </Container >
        )
    }
}