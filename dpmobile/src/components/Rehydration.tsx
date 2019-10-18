import React from "react"
import { connect } from "react-redux"
import { Action, Dispatch } from "redux"
import { initialize } from "redux-form"
import { handleSetFilledForms, handleSetRootForms, handleSetUser } from "../redux/actions/action"
import { User } from "../redux/actions/types"
import { loadState } from "../redux/configureStore"

type RehydraterProps = {
    restoreUser: (user: User) => void;
    restoreFileldForms: (ff: any) => void;
    restoreRootForms: (roots: any) => void;
}
type RehydraterState = {
    loading: boolean;
}
class Rehydrater extends React.Component<RehydraterProps, RehydraterState>{
    async componentDidMount() {
        const state = await loadState();
        if (state) {
            if (state.user) {
                this.props.restoreUser(state.user);
            }
            if (state.rootForms) {

                this.props.restoreRootForms(state.rootForms.byId);
            }
            if (state.filledForms) {
                this.props.restoreFileldForms(state.filledForms.byId);
            }
            if (state.form) {
                console.log(state.form);
                Object.keys(state.form).forEach(key => {
                    initialize(key, state.form[key]);
                });
            }
        }
    }
    render() {
        return null;
    }
}
const mapStateToProps = (state, props) => {
    return {

    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        restoreUser: (user: User) => dispatch(handleSetUser(user)),
        restoreFileldForms: (ff: any) => dispatch(handleSetFilledForms(ff)),
        restoreRootForms: (roots: any) => dispatch(handleSetRootForms(roots)),
        // restoreFormValues: (values: any)=>dispatch(handleUpdateFormValues(values))
    }
}
export const ConnectedRehydrater = connect(mapStateToProps, mapDispatchToProps)(Rehydrater);