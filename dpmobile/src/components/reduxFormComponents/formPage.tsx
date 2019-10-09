import { QAQuestion, QuestionSection } from 'dpform';
import React from 'react';
import { Input } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form';
import { getRootFormSectionById } from '../../redux/selectors/questionSelector';

type SectionPageProps = {
    sectionId: string;
    section: QuestionSection;
    duplicateTimes: number;
    formId: string;
    rootId: string;
} & InjectedFormProps
export class SectionPage_ extends React.Component<SectionPageProps>{


    renderField(props) {
        const { input, ...inputProps } = props;
        return <Input
            {...inputProps}
            onChangeText={input.onChange}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
            value={input.value} />
    }
    renderSectionItems({ fields, meta: { error, submitFailed } }) {
        const fieldsLength = fields.length;
        if (fieldsLength === 0) fields.push();
        else if (this.props.duplicateTimes !== fieldsLength) {
            if (this.props.duplicateTimes < fieldsLength) {
                for (let i = 0; i < this.props.duplicateTimes - fieldsLength; i++) {
                    fields.push();
                }
            } else {
                for (let i = 0; i < fieldsLength - this.props.duplicateTimes; i++) {
                    fields.pop();
                }
            }
        }
        return fields.map((field, iteration) => {
            return this.props.section.content.map((item, index) => {
                if (item instanceof QAQuestion) {
                    return <Field key={'field' + item.id} name={`${field}.${item.id}`} component={this.renderField.bind(this)} />
                } else if (item instanceof QuestionSection) {
                    return <SectionPage key={'section-' + item.id} id={item.id} />
                }
            })
        })
    }
    render() {
        return <>
            <FieldArray name={this.props.section.id} component={this.renderSectionItems.bind(this)} />
            {/* <Text>{JSON.stringify(formValueSelector(this.props.formId))}</Text> */}
        </>
    }
}


const mapStateToProps = (state, props) => {
    return {
        section: getRootFormSectionById(state, props),
        form: props.formId
    }
};
const mapDispatchToProps = (dispatch) => ({

});

const Form = reduxForm({
    destroyOnUnmount: false,
})(SectionPage_);

export const SectionPage = connect(mapStateToProps, mapDispatchToProps)(Form)
