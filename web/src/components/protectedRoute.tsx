import React from "react";
import { Redirect, Route, RouteProps } from "react-router";

export type ProtectedRouteProps = {
    authToken?: string;
} & RouteProps;

export class ProtectedRoute extends Route<ProtectedRouteProps>{
    
    render() {
        console.log(this.props.authToken);
        
        if (!!this.props.authToken) {
            return <Route {...this.props} />
        }
        const redirect = () => <Redirect to={{ pathname: "/login" }} />;
        return <Route {...this.props} component={redirect} render={undefined} />
    }
}