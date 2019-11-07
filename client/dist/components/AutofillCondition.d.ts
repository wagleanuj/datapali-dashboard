import React from "react";
import { QAQuestion, IAutoAnswer, AnswerOptions, IValueType, IAnswerCondition, ILiteral } from "dpform";
interface AutoAnswerProps {
    definedQuestions: {
        [key: string]: QAQuestion;
    };
    onChange: (a: IAutoAnswer) => void;
    options?: AnswerOptions;
    answerType: IValueType;
    autoAnswer: IAutoAnswer;
}
interface AutoAnswerState {
    aConditions: IAnswerCondition[];
    isEnabled: boolean;
}
export declare class AutofillCondition extends React.Component<AutoAnswerProps, AutoAnswerState> {
    constructor(props: AutoAnswerProps);
    editIfTrueFalseValue(type: string, index: number, value: string): void;
    openConditionModal(index: number): void;
    changeEnabled(): void;
    addAutoFillCondition(): void;
    editCondition(index: number, data: ILiteral[]): void;
    removeAutofillCondition(index: number): void;
    render(): JSX.Element;
}
export {};
