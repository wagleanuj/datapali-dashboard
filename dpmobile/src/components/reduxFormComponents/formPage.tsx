import { QAQuestion, QuestionSection } from 'dpform';
import React from 'react';
import { Input, Text, ThemedComponentProps } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form';
import { getRootFormSectionById } from '../../redux/selectors/questionSelector';
import { Formik, FieldArray as FA, Field as FIELD, FormikValues, FieldProps } from 'formik';
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

type SectionFormProps = {
    section: QuestionSection;
    sectionId: string;
    formId: string;
    rootId: string;
    duplicateTimes: number;
} & ThemedComponentProps
export class SectionForm_ extends React.Component<SectionFormProps, {}>{
    makeFields(section: QuestionSection) {
        const values = [];
        let times = 0;
        if (!this.props.duplicateTimes) {
            times = 1;
        }
        else if (this.props.duplicateTimes === -1) {
            return times = 1;
        }
        else {
            times = this.props.duplicateTimes
        }
        for (let iteration = 0; iteration < times; iteration++) {
            section.content.forEach((item, index) => {
                if (!values[iteration]) values[iteration] = {};
                if (item instanceof QAQuestion) {
                    values[iteration][item.id] = 'test value'; //load
                }
                else if (item instanceof QuestionSection) {
                    values[iteration][item.id] = this.makeFields(item);
                }
            })
        }
        return values;
    }

    renderFieldArray(item: any[], name: string, handleChange) {
        console.log(name);
        return <FA
            name={name}
            render={(arrayHelpers) => {
                return item.map((it, index) => this.renderFieldArrayItem(it, name.concat(`[${index}]`), handleChange))
            }}
        />
    }
    renderFieldArrayItem(item: { [key: string]: any }, name: string, handleChange) {
        return Object.keys(item).map((key, ind) => {
            const currItem = item[key];
            if (Array.isArray(currItem)) {
                return this.renderFieldArray(currItem, name.concat('.', key), handleChange);
            } else {
                let newName = name.concat('.', key);
                return <FIELD
                    key={newName}
                    name={newName}
                    render={(props: FieldProps) => {
                        const { field, form } = props;
                        return <Input
                            onChangeText={handleChange(newName)}
                            onBlur={props.field.onBlur}
                            {...field}
                        />
                    }}
                />
            }
        })
    }
    render() {
        return <Formik
            initialValues={{ [this.props.sectionId]: this.makeFields(this.props.section) }}
            enableReinitialize={true}
            onSubmit={(values) => {
                console.log(values);
            }}
            render={({ values, errors, touched, handleReset, handleChange, setFieldValue }) => {
                return <>
                    {this.renderFieldArray(values[this.props.sectionId], this.props.sectionId, handleChange)}
                    <Text>{JSON.stringify(values)}</Text>
                </>

            }}
        />
    }
}
export const SecForm = connect(mapStateToProps, mapDispatchToProps)(SectionForm_)
