import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Action, Dispatch } from "redux";
import { initialize, reduxForm } from "redux-form";
import { handleAddNewForm, handleAddRootForm } from "../../actions/actions";
import { IAppState, IFilledForm, IRootForm } from "../../types";
import { FormViewer, FormViewerProps } from "./formviewer.component";
const mapStateToProps = (state: IAppState, props: FormViewerProps) => {
    const params = new URLSearchParams(props.location.search);
    const formId = params.get("formId");
    const rootId = params.get("rootId");
    return {
        form: formId,
        filledForm: state.filledForms.byId[formId],
        rootForm: state.rootForms.byId[rootId]
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        handleRootFormAdd: (rootId: string, form: IRootForm) => dispatch(handleAddRootForm(rootId, form)),
        handleFilledFormAdd: (id: string, form: IFilledForm) => dispatch(handleAddNewForm(id, form)),
        initializeForm: (formId: string, formValues: any) => dispatch(initialize(formId, formValues))

    }
}
export const InjectedFormViewer = (reduxForm({
    destroyOnUnmount: false,
})(FormViewer))

export const ConnectedFormViewer = connect(mapStateToProps, mapDispatchToProps)(InjectedFormViewer);
export const FormViewerW = withRouter(ConnectedFormViewer);

