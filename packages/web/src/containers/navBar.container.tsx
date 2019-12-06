import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { handleLogout } from "../actions/actions";
import { NavBar, NavBarProps } from "../components/navBar.component";
import { persistor } from "../configureStore";
import { IAppState } from "../types";

const mapStateToProps = (state: IAppState, props: NavBarProps) => {
    return {
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        onLogoutClick: () => {
            dispatch(handleLogout());
            persistor.purge();
        }
    }
}

export const ConnectedNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar);