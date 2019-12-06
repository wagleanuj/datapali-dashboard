import { ANSWER_TYPES, getReadablePath, IValueType } from "@datapali/dpform"
import { DatePicker, Form, Input, Radio } from "antd"
import React from "react"
import { WrappedFieldInputProps, WrappedFieldMetaProps, WrappedFieldProps } from "redux-form"
import { IDependency } from "../../helper"
import { IQuestionRenderProps } from "./questionNode.container"




function QuestionItem(props: { question: IQuestionRenderProps, path: number[], fieldProps: WrappedFieldProps }) {
    switch (props.question.type.name) {
        case ANSWER_TYPES.NUMBER:
            return <Input key={'form-input' + props.fieldProps.input.name} value={props.fieldProps.input.value} onChange={props.fieldProps.input.onChange} type="number" />

        case ANSWER_TYPES.STRING:
            return <Input key={'form-input' + props.fieldProps.input.name} value={props.fieldProps.input.value} onChange={props.fieldProps.input.onChange} type="text" />

        case ANSWER_TYPES.GEOLOCATION:
            return <Input key={'form-input' + props.fieldProps.input.name} value={props.fieldProps.input.value} onChange={props.fieldProps.input.onChange} type="number" />

        case ANSWER_TYPES.DATE:
            return <DatePicker key={'form-input' + props.fieldProps.input.name} {...props.fieldProps.input} />


        case ANSWER_TYPES.SELECT:
            return <SelectInput value={props.fieldProps.input.value} key={'form-input' + props.fieldProps.input.name} options={props.question.options} onChange={props.fieldProps.input.onChange} />
    }
}
type SelectInputProps = {
    options: { text: string, id: string }[],
    onChange: any;
    value: string;
};
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};
function SelectInput(props: SelectInputProps) {
    return (
        <Radio.Group value={props.value} onChange={props.onChange}>
            {props.options.map(item => {
                return (
                    <Radio style={radioStyle} key={item.id} value={item.id}>{item.text}</Radio>
                )
            })}
        </Radio.Group>
    )
}

interface SprayedFieldProps {
    isRequired: boolean;
    autoCompleteData: { strength: number, text: string }[],
    options: { id: string, text: string }[],
    type: IValueType,
    dependencies: IDependency,
    title: string,
    path: number[]
}


export type FieldProps = {
    input: WrappedFieldInputProps;
    meta: WrappedFieldMetaProps;
} & SprayedFieldProps;
export const renderQuestion = (fieldProps: FieldProps) => {
    const { input, meta, ...custom } = fieldProps;
    const title = <div>
<strong>{getReadablePath(custom.path)} {custom.title} {fieldProps.isRequired?"*":""}</strong>
    </div>
    return <Form.Item key={'form-item' + fieldProps.input.name}>
        {title}
        <QuestionItem key={'form-question' + fieldProps.input.name} question={custom} path={custom.path} fieldProps={fieldProps} />
    </Form.Item>;

}