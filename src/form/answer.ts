import { string } from "prop-types";
import { QACondition, QAFollowingOperator } from "./condition";
import { QAQuestion } from "./question";

export class Answer {
    content: QAContent;
    condition!: QACondition;
    constructor(content: QAContent) {
        this.content = content;
    }

    get Condition(): QACondition {
        return this.condition;
    }

    get Content(): QAContent {
        return this.content;
    }

    setContent(content: QAContent) {
        this.content = content;
        return this;
    }

    setCondition(condition: QACondition) {
        this.condition = condition;
        return this;
    }
}

export interface QAContent {
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

export interface QALiteral {
    literalId: string 
    questionObj: QAQuestion|undefined
    questionRef: string | undefined
    comparisonOperator: QAComparisonOperator | undefined,
    comparisonValue: QAContent | undefined,
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