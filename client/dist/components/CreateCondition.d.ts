import React from "react";
import { ILiteral, QAQuestion, QACondition } from "dpform";
declare enum TableFieldType {
    QuestionRef = 1,
    ComparisonOperator = 2,
    ComparisonValue = 3,
    FollowingOperator = 4
}
declare type CreateConditionState = {
    literals: ILiteral[];
};
declare type CreateConditionProps = {
    definedQuestions?: {
        [key: string]: QAQuestion;
    };
    onChange?: (data: ILiteral[]) => void;
    literals?: Array<ILiteral>;
    setLiteralsSetter?: Function;
    condition?: QACondition;
};
export declare class CreateCondition extends React.Component<CreateConditionProps, CreateConditionState> {
    columns: {
        dataField: string;
        text: string;
    }[];
    static readonly defaultProps: CreateConditionProps;
    constructor(props: CreateConditionProps);
    componentDidMount(): void;
    setLiterals(newLiterals: ILiteral[]): void;
    addLiteral(literal?: ILiteral): void;
    moveLiteralUp(index: number): void;
    handleDataChange(literalIndex: number, valueField: TableFieldType, newValue: any): void;
    getQuestion(questionRef?: string): QAQuestion;
    removeLiteral(index: number): void;
    render(): JSX.Element;
}
export {};
