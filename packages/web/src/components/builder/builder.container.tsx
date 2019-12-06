import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { formValueSelector, reduxForm } from "redux-form";
import { handleAddItemToRootForm } from "../../actions/actions";
import { IAppState } from "../../types";
import { IQuestion, ISection } from "../formfiller/types";
import { Builder } from "./builder.component";

const mapStateToProps = (state: IAppState, props: any) => {
    const selector = formValueSelector(props.form);
    return {
        getNode: (nodeId: string) => selector(state, nodeId)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        handleAddItemInForm: (rootId: string, parentId: string, item: ISection | IQuestion) => dispatch(handleAddItemToRootForm(rootId, parentId, item))
    }
}
const InjectedBuilder = reduxForm({
    enableReinitialize: false
})(Builder)
export const ConnectedBuilder = connect(mapStateToProps, mapDispatchToProps)(InjectedBuilder);