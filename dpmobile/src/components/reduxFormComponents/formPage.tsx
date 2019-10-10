import { QAQuestion, QuestionSection, RootSection } from 'dpform';
import { FastField, Field as FIELD, FieldArray as FA, Formik } from 'formik';
import prettyFormat from 'pretty-format';
import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Input, Text, ThemedComponentProps } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form';
import { FormItem } from '../../formComponents/surveyformitem';
import { getRootFormById } from '../../redux/selectors/availableFormSelector';
import { getRootFormSectionById } from '../../redux/selectors/questionSelector';
import { Showcase } from '../showcase.component';
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
        });
    }
    render() {
        return <>
            <FieldArray name={this.props.section.id} component={this.renderSectionItems.bind(this)} />
            {/* <Text>{JSON.stringify(formValueSelector(this.props.formId))}</Text> */}
        </>
    }
}


const mapStateToProps = (state, props) => {
    const s = getRootFormSectionById(state, props);
    return {
        section: s,
        form: props.formId,
        root: getRootFormById(state, props)
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
    root: RootSection;
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
                    values[iteration][item.id] = undefined;
                }
                else if (item instanceof QuestionSection) {
                    values[iteration][item.id] = this.makeFields(item);
                }
            })
        }
        return values;
    }

    renderFieldArray(item: any[], name: string, handleChange, path: number[]) {

        return <FA
            key={name}
            name={name}
            render={(arrayHelpers) => {
                return item.map((it, index) => this.renderFieldArrayItem(it, name.concat(`[${index}]`), handleChange, path.concat(index)))
            }}
        />
    }
    renderFieldArrayItem(item: { [key: string]: any }, name: string, handleChange, path) {
        return Object.keys(item).map((key, ind) => {
            const currItem = item[key];
            if (currItem && Array.isArray(currItem)) {
                return this.renderFieldArray(currItem, name.concat('.', key), handleChange, path.concat(ind));
            } else {
                let newName = name.concat('.', key);
                console.log(this.props.root)
                // const question: QAQuestion = this.props.root.questions[key];
                // let shouldbefastfield = !Helper.checkIfQuestionHasCondition(question);

                let child = (props) => <FormItem

                    value={props.field.value}
                    path={path.concat(ind)}
                    formId={this.props.formId}
                    rootId={this.props.rootId}
                    questionId={key}
                    onChange={handleChange(newName)}
                />
                if (true) {
                    return <FastField
                        key={newName}
                        name={newName}
                        render={child}
                    />
                }
                return <FIELD name={newName} key={newName} render={child} />
            }
        })
    }
    render() {
        const res = this.makeFields(this.props.section);
        return <ScrollView>
            <Formik
                initialValues={{ [this.props.sectionId]: res }}
                onSubmit={(values) => {
                    console.log(values);
                }}
                render={({ values, errors, touched, handleReset, handleChange, setFieldValue }) => {
                    return <>
                        {this.renderFieldArray(values[this.props.sectionId], this.props.sectionId, handleChange, [0, 0])}
                        <Text>{prettyFormat(values)}</Text>
                    </>

                }}
            />
        </ScrollView>
    }
}
export const SecForm = connect(mapStateToProps, mapDispatchToProps)(SectionForm_)


