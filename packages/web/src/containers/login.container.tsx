import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";
import { clearSubmitErrors, reduxForm, SubmissionError } from "redux-form";
import { handleSetUser } from "../actions/actions";
import { LoginComponent, LoginOwnProps, LoginProps } from "../components/login.component";
import { IAppState, IFilledForm, IUser } from "../types";
const LOGIN = gql`
query Login($email: String!, $password: String!){
    login(email: $email, password: $password){
      token
      user{
          _id
          firstName
          lastName
          accountType
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
  }
`;


const mapStateToProps = (state: IAppState, props: LoginProps) => {
    return {
        authToken: state.user.token
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {

    return {

        customSubmit: function (client: ApolloClient<any>) {
            return async (values: { email: string, password: string }) => {
                return client.query<any, { email: string, password: string }>({
                    query: LOGIN,
                    variables: {
                        email: values.email,
                        password: values.password,
                    },
                    errorPolicy: 'none'
                })
                    .then(value => {
                        const login = value.data.login;

                        let user: IUser = {
                            id: login.user._id,
                            token: login.token,
                            availableForms: login.user.availableForms.map((item: any) => item.id),
                            firstName: login.user.firstName,
                            lastName: login.user.lastName,
                            filledForms: login.user.filledForms.map((item: any) => item.id),
                            accountType: login.user.accountType,
                            createdForms: login.user.createdForms ? login.user.createdForms.map((item: any) => item.id) : [],
                        }
                        let rootForms: any = {};
                        login.user.availableForms.forEach((v: any) => {
                            if (typeof v.content === "string") v.content = JSON.parse(v.content);
                            rootForms[v.id] = v.content;
                        });
                        let filledForms: any = {};
                        login.user.filledForms.forEach((v: any) => {
                            if (typeof v.answerStore === 'string') v.answerStore = JSON.parse(v.answerStore);
                            filledForms[v.id] = {
                                completedDate: parseInt(v.completedDate),
                                filledBy: v.filledBy,
                                formId: v.formId,
                                id: v.id,
                                startedDate: parseInt(v.startedDate),
                                submitted: true,
                            } as IFilledForm
                                ;
                        });
                        dispatch(handleSetUser(user));
                        return login.user.token;

                    })
                    .catch(err => {
                        throw new SubmissionError({
                            _error: "Incorrect email or password"
                        });
                    });
            }
        }
    }
}

type Value = {
    email: string;
    password: string;
}

export const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginComponent)

export const LoginForm = reduxForm<Value, LoginOwnProps>({
    form: "login",
    onChange: (values, dispatch, props) => dispatch(clearSubmitErrors('login'))
})(ConnectedLoginForm)