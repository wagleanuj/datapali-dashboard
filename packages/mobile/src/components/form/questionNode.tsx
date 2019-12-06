import React from 'react';
import { ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { Action, Dispatch } from 'redux';
import { Field, WrappedFieldProps } from "redux-form";
import { DAppState } from '../../redux/actions/types';
import { getQuestionValidators } from '../../redux/selectors/questionSelector';
import { ConnectedFormItem } from './surveyformitem';

type validatorFunction = (value: string | undefined) => string | undefined;
type QuestionNodeProps = {
    path: number[];
    questionId: string;
    locationName: string;
    formId: string;
    rootId: string;
    validators?: validatorFunction[];
    onSubmit: () => void;
    setInputRef: (r) => void;
} & ThemedComponentProps;
class QuestionNode extends React.Component<QuestionNodeProps, {}>{
    formInput: any;

    renderComponent = (props: WrappedFieldProps) => {
        const { locationName, formId, questionId, rootId, path, onSubmit } = this.props;
        const { input, meta } = props;
        return (
                <ConnectedFormItem
                    setInputRef={this.props.setInputRef}
                    valueLocationName={locationName}
                    formId={formId}
                    questionId={questionId}
                    rootId={rootId}
                    value={input.value}
                    onChange={input.onChange}
                    path={path}
                    error={meta.error}
                    onSubmit={onSubmit}
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
const QuestionNodeStyled = withStyles(QuestionNode, theme => ({
   
}))

const mapStateToProps = (state: DAppState, props: QuestionNodeProps) => {
    return {
        validators: getQuestionValidators(state, props)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {

    }
}

export const ConnectedQuestionNode = connect(mapStateToProps, mapDispatchToProps)(QuestionNodeStyled);