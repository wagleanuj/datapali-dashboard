import React from "react";
import { IValueType, QAComparisonOperator, Constants, QAQuestion, ILiteral, AnswerOptions, IAutoAnswer, AnswerType } from "dpform";
export declare function getOperatorForType(valueType?: IValueType): QAComparisonOperator[];
export declare const customStyles: {
    container: (base: any, state: any) => any;
    control: (base: any, state: any) => any;
    valueContainer: (base: any, state: any) => any;
    menu: (base: any, state: any) => any;
    menuList: (base: any, state: any) => any;
    singleValue: (base: any, state: any) => any;
    input: (base: any, state: any) => any;
    option: (base: any, state: any) => any;
};
interface FormItemProps {
    constants: Constants;
    definedQuestions: {
        [key: string]: QAQuestion;
    };
    question: QAQuestion;
    onChange: (question: QAQuestion) => void;
}
interface FormItemState {
    question: QAQuestion;
}
export declare class DPFormItem extends React.Component<FormItemProps, FormItemState> {
    static defaultProps: {
        question: QAQuestion;
    };
    constructor(props: any);
    handleChange(): void;
    handleRequiredChange(e: any): void;
    openAppearingConditionModal(): void;
    editAppearingCondition(newLiterals: ILiteral[]): void;
    handleQuestionChange(e: string): void;
    handleAnswerTypeChange(type: IValueType): void;
    handleOptionsChange(options: AnswerOptions): void;
    handleAutoFillChange(autoanswer: IAutoAnswer): void;
    handleCustomIdChange(newId: string): void;
    render(): JSX.Element;
}
export interface ISelectOption {
    value: string | keyof typeof AnswerType;
    label: string;
}
export {};
