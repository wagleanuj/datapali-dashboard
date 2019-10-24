import React from 'react';
import { connect } from "react-redux";
import { Field, WrappedFieldProps } from "redux-form";
import { getQuestionValidators } from '../../redux/selectors/questionSelector';
import { ConnectedFormItem } from './surveyformitem';
import { DAppState } from '../../redux/actions/types';
import { Dispatch, Action } from 'redux';

type validatorFunction = (value: string | undefined) => string | undefined;
type QuestionNodeProps = {
    path: number[];
    questionId: string;
    locationName: string;
    formId: string;
    rootId: string;
    validators: validatorFunction[]
}
class QuestionNode extends React.Component<QuestionNodeProps, {}>{
    renderComponent = (props:WrappedFieldProps) => {
        const { locationName, formId, questionId, rootId, path } = this.props;
        const { input, meta } = props;
        console.log(meta);
        return (
            <ConnectedFormItem
                valueLocationName={locationName}
                formId={formId}
                questionId={questionId}
                rootId={rootId}
                value={input.value}
                onChange={input.onChange}
                path={path}
                error={meta.error}
            />
        )
    }
    render() {
        return (
            <Field
                name={this.props.locationName}
                component={this.renderComponent}
                validate={this.props.validators}
            />

        )
    }
}

const mapStateToProps = (state:DAppState, props:QuestionNodeProps) => {
    return {
        validators: getQuestionValidators(state, props)
    }
}

const mapDispatchToProps = (dispatch:Dispatch<Action>) => {
    return {

    }
}

export const ConnectedQuestionNode = connect(mapStateToProps, mapDispatchToProps)(QuestionNode);