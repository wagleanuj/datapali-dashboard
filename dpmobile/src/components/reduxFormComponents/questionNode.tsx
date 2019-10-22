import React from 'react';
import { connect } from "react-redux";
import { Field } from "redux-form";
import { ConnectedFormItem } from './surveyformitem';

type QuestionNodeProps = {
    path: number[];
    questionId: string;
    locationName: string;
    formId: string;
    rootId: string;
}
class QuestionNode extends React.Component<QuestionNodeProps, {}>{
    renderComponent = (props) => {
        const { locationName, formId, questionId, rootId, path } = this.props;
        const { input } = props;
        return (
            <ConnectedFormItem
                valueLocationName={locationName}
                formId={formId}
                questionId={questionId}
                rootId={rootId}
                value={input.value}
                onChange={input.onChange}
                path={path}
            />
        )
    }
    render() {
        return (
            <Field
                name={this.props.locationName}
                component={this.renderComponent}
            />

        )
    }
}

const mapStateToProps = (state, props) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export const ConnectedQuestionNode = connect(mapStateToProps, mapDispatchToProps)(QuestionNode);