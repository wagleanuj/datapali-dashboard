import { QACondition, QAFollowingOperator } from './condition';
export declare class Answer {
    content: IContent;
    condition: QACondition;
    constructor(content: IContent);
    readonly Condition: QACondition;
    readonly Content: IContent;
    setContent(content: IContent): this;
    setCondition(condition: QACondition): this;
}
export interface IContent {
    content: string;
    type: QAType;
}
export declare enum QAComparisonOperator {
    Less_Than_Or_Equal = "<=",
    Greater_Than_Or_Equal = ">=",
    Less_Than = "<",
    Greater_Than = ">",
    Equal = "=="
}
export interface ILiteral {
    literalId: string;
    questionRef: string | undefined;
    comparisonOperator: QAComparisonOperator | undefined;
    comparisonValue: IContent | undefined;
    followingOperator: QAFollowingOperator | undefined;
}
export declare enum AnswerType {
    String = "String",
    Boolean = "Boolean",
    Date = "Date",
    Time = "Time",
    Number = "Number",
    Select = "Select"
}
export declare enum QAType {
    String = "string",
    html = "html"
}
