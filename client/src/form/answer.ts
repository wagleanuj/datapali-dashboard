import { QACondition, QAFollowingOperator } from "./condition";

export class Answer {
    content: IContent;
    condition!: QACondition;
    constructor(content: IContent) {
        this.content = content;
    }

    get Condition(): QACondition {
        return this.condition;
    }

    get Content(): IContent {
        return this.content;
    }

    setContent(content: IContent) {
        this.content = content;
        return this;
    }

    setCondition(condition: QACondition) {
        this.condition = condition;
        return this;
    }
}

export interface IContent {
    content: string
    type: QAType
}

export enum QAComparisonOperator {
    Less_Than_Or_Equal = "<=",
    Greater_Than_Or_Equal = ">=",
    Less_Than = "<",
    Greater_Than = ">",
    Equal = "=="
}

export interface ILiteral {
    literalId: string 
    questionRef: string | undefined
    comparisonOperator: QAComparisonOperator | undefined,
    comparisonValue: IContent | undefined,
    followingOperator: QAFollowingOperator | undefined
}

export enum AnswerType {
    String = "String",
    Boolean = "Boolean",
    Date = "Date",
    Time = "Time",
    Number = "Number",
    Select = "Select"
}

export enum QAType {
    String = "string",
    html = "html"
}