import { ANSWER_TYPES } from "@datapali/dpform";
import { DatePicker, Input, Radio } from "antd";
import React from "react";
import { WrappedFieldProps } from "redux-form";
import { FilledFormsPage } from "./components/filledFormsPage.component";
import { FormBuilder } from "./components/formbuilder.component";
import { renderQuestion } from "./components/formfiller/formItem.component";
import { FormViewerW } from "./components/formfiller/FormViewer.container";
import { IQuestionRenderProps } from "./components/formfiller/questionNode.container";
import { Forms } from "./components/forms.component";
import { ISidebarItemNode } from "./components/navMenu.component";
import { Statistics } from "./components/statistics.component";
import { Users } from "./components/surveyors.component";
export const tabs: ISidebarItemNode[] = [
    {
        title: "Forms",
        routeKey: "/forms",
        icon: "form",
        component: <Forms />,
        children: [

        ]
    },
    {
        title: "Surveyors",
        routeKey: "/surveyors",
        icon: "user",
        component: <Users />,
        children: []
    },
    {
        title: "Statistics",
        routeKey: "/statistics",
        icon: "pie-chart",
        component: <Statistics />,
        children: []
    },

    {
        title: "Form Builder",
        routeKey: "/formbuilder",
        hideOnSidebar: true,
        icon: "form",
        children: [],
        component: <FormBuilder />
    },

    {
        title: "Filled Forms",
        routeKey: "/filledForms",
        hideOnSidebar: false,
        icon: "form",
        children: [],
        component: <FilledFormsPage />
    },

    {
        title: "Form Builder",
        routeKey: "/formviewer",
        hideOnSidebar: true,
        icon: "form",
        children: [],
        //@ts-ignore
        component: <FormViewerW
            renderSectionHeader={(sectionName: string, path: number[]) => {
                return null;
            }}
            renderQuestion={renderQuestion}
        />
    },

]
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
            return <SelectInput key={'form-input' + props.fieldProps.input.name} options={props.question.options} onChange={props.fieldProps.input.onChange} />
    }
}
type SelectInputProps = {
    options: { text: string, id: string }[],
    onChange: any;
}
const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};
function SelectInput(props: SelectInputProps) {
    return (
        <Radio.Group onChange={props.onChange}>
            {props.options.map(item => {
                return (
                    <Radio style={radioStyle} key={item.id} value={item.id}>{item.text}</Radio>
                )
            })}
        </Radio.Group>
    )
}