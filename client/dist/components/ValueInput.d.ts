import React from "react";
import { ISelectOption } from "./DPFormItem";
import { AnswerType, IAnswerOption } from "dpform";
interface ValueInputProps {
    onChange: Function;
    questionType: AnswerType | undefined;
    options?: ISelectOption[];
    value: IAnswerOption;
}
interface ValueInputState {
}
export declare class ValueInput extends React.Component<ValueInputProps, ValueInputState> {
    constructor(props: ValueInputProps);
    onDataChange(data: any): void;
    render(): any;
}
export {};
