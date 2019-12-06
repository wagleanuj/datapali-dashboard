import { ANSWER_TYPES, IValueType } from "@datapali/dpform";
import { Cascader, Form, Switch } from "antd";
import FormItem from "antd/lib/form/FormItem";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { Field, FormSection, WrappedFieldInputProps, WrappedFieldProps } from "redux-form";
// export interface IQuestion {
//     _type: typeof QUESTION;
//     id: string;
//     answerType: IValueType;
//     questionContent: IContent;
//     options: IAnswerOptions;
//     isRequired: boolean;
//     creationDate: number;
//     customId: string;
// }
const booleanType = { value: ANSWER_TYPES.BOOLEAN, label: "YES/NO" };
const stringType = { value: ANSWER_TYPES.STRING, label: "Text" };
const timeType = { value: ANSWER_TYPES.TIME, label: "Time" };
const dateType = { value: ANSWER_TYPES.DATE, label: "Date" };
const numberType = { value: ANSWER_TYPES.NUMBER, label: "Number" };
const geoType = { value: ANSWER_TYPES.GEOLOCATION, label: "Geo location" };

const rangeType = {
    value: ANSWER_TYPES.RANGE, label: "Range", children: [
        dateType,
        timeType,
        numberType,
    ]
};
const selType = {
    value: ANSWER_TYPES.SELECT, label: "Multiple Choice", children: [
        stringType,
        numberType,
        geoType,
        dateType,
        timeType,
        rangeType
    ]
}


const typeOptions = [
    booleanType,
    stringType,
    timeType,
    dateType,
    numberType,
    rangeType,
    selType
]
type TitleProps = {

}
const Title = (props: TitleProps & WrappedFieldInputProps) => {
    return null;
}
export class QuestionForm extends React.Component<any, any>{
    renderTitle = (props: WrappedFieldProps) => {
        return <FormItem label="Title">
            <TextArea {...props.input}
                autoSize
                value={props.input.value.content}
                onChange={e => props.input.onChange({ content: e.target.value, type: "text" })}
                onBlur={() => { }}
            />
        </FormItem>;
    }
    renderIsRequired = (props: WrappedFieldProps) => {
        return <FormItem label="Required">
            <Switch {...props.input} />
        </FormItem>;
    }
    renderAnswerType = (props: WrappedFieldProps) => {
        const getAnswerType = (arr) => {
            const ret: IValueType = {
                name: undefined,
                ofType: undefined,
            }
            let curr = ret;
            arr.forEach((a: any, index: number) => {
                curr.name = a;
                if (index <= arr.length) {
                    curr.ofType = { name: undefined }
                    curr = curr.ofType
                }
            });
            return ret;
        }
        const parseAnswerType = (type: IValueType, ret = []) => {
            if (!type) return ret;
            ret.push(type.name);
            if (type.ofType && type.ofType.name) {
                parseAnswerType(type.ofType, ret);
            }
            return ret;
        }

        return <FormItem label="Answer Type">
            <Cascader size="large"
                options={typeOptions}
                {...props.input}
                value={parseAnswerType(props.input.value)}
                onChange={values => props.input.onChange(getAnswerType(values))} />
        </FormItem>;
    }
    renderOptions = (props: WrappedFieldProps) => {
        return null;
    }
    renderAppearingCondition = (props: WrappedFieldProps) => {
        return null;
    }
    render() {
        return (
            <Form layout="horizontal">

                <FormSection name={this.props.questionId}>
                    <Field
                        name="questionContent"
                        component={this.renderTitle}
                    />
                    <Field
                        name="isRequired"
                        type={"checkbox"}
                        component={this.renderIsRequired}
                    />
                    <Field
                        name="answerType"
                        component={this.renderAnswerType}
                    />
                    <Field
                        name="options"
                        component={this.renderOptions}
                    />
                    <Field
                        name="appearingCondition"
                        component={this.renderAppearingCondition}
                    />


                </FormSection>
            </Form>



        )
    }
}