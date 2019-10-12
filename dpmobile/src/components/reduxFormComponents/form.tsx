import { reduxForm, InjectedFormProps } from "redux-form"
import { connect } from "react-redux"
import React from "react"
import { ConnectedSectionNode } from "./sectionNode";

type FormPageProps = {
    formId: string;
} & InjectedFormProps;
class FormPage_ extends React.Component<FormPageProps, {}>{
    render() {
        return (
            <ConnectedSectionNode />
        )
    }
}
const FormPage = (reduxForm({
    destroyOnUnmount: false,
})(FormPage_))

const mapStateToProps = (state, props) => {
    return {
        form: props.formId,
    }
};

const mapDisPatchToProps = (dispatch) => {
    return {

    }
};

export const ConnectedFormPage = connect(mapStateToProps, mapDisPatchToProps)(FormPage);