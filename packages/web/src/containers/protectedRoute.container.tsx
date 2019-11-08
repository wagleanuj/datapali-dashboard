import { connect } from "react-redux";
import { ProtectedRoute, ProtectedRouteProps } from "../components/protectedRoute";
import { IAppState } from "../types";

const mapStateToProps = (state: IAppState, props: ProtectedRouteProps) => {
    return {
        authToken: state.user.token
    }
}
const mapDispatchToProps = () => ({});

export const ConnectedProtectedRoute = connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute)