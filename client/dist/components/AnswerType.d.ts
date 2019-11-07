import React from "react";
import { IValueType } from "dpform";
interface AnswerTypeInputProps {
    answerType: IValueType;
    onChange: (val: IValueType) => void;
}
interface AnswerTypeInputState {
    answerType: IValueType;
}
export declare class AnswerTypeInput extends React.Component<AnswerTypeInputProps, AnswerTypeInputState> {
    static defaultProps: {
        answerType: {
            name: any;
            ofType: any;
        };
    };
    constructor(props: AnswerTypeInputProps);
    handleAnswerTypeChange(data: any): void;
    handleSecondSelectChange(data: any): void;
    handleThirdSelectChange(data: any): void;
    render(): JSX.Element;
}
export {};
