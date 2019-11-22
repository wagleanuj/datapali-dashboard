import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { IAppState } from "../../types";
import { Builder } from "./builder.component";

const mapStateToProps = (state: IAppState, props: any) => {
    return {

    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {

    }
}

const ConnectedBuilder = connect(mapStateToProps, mapDispatchToProps)(Builder);