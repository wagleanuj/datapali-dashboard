import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { handleAddItemToRootForm } from "../../actions/actions";
import { IAppState } from "../../types";
import { IQuestion, ISection } from "../formfiller/types";
import { Builder } from "./builder.component";

const mapStateToProps = (state: IAppState, props: any) => {
    return {
        tree: state.rootForms.byId[props.formId]
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        handleAddItemInForm: (rootId: string, parentId: string, item: ISection | IQuestion) => dispatch(handleAddItemToRootForm(rootId, parentId, item))
    }
}

export const ConnectedBuilder = connect(mapStateToProps, mapDispatchToProps)(Builder);