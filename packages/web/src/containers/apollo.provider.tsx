import { IAppState } from "../types";
import { ApProps, CustomApolloProvider } from "../components/apollo.component";
import { connect } from "react-redux";

const mapStateToProps = (state: IAppState, props: ApProps) => {
    return {
        authToken: state.user.token
    }
}
export const ConnectedApolloProvider = connect(mapStateToProps, null)(CustomApolloProvider);