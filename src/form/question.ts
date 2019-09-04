import { QACondition } from "./condition";
import { QAContent, QAType } from "./answer";
import { getRandomId } from "../utils/getRandomId";
import { QAValueType } from "../components/AnswerType";
import { AnswerOptions, QAOption } from "../components/AnswerOptions";

export class QAQuestion {
    id!: string;
    isRequired!: boolean;
    validate!: Function;
    referenceId!: string;
    appearingCondition!: QACondition;
    questionContent!: QAContent;
    creationDate!: number;
    autoAnswer!: QAAutoAnswer
    options!: AnswerOptions;
    answerType!: QAValueType;
    content=[]

    constructor() {
        this.autoAnswer = {
            isEnabled: false,
            answeringConditions: []
        }
        this.id = getRandomId("q-");
        this.questionContent = { content: "", type: QAType.String }
    }
    updateFromQuestion(q: QAQuestion){
        this.isRequired = q.isRequired;
        this.validate =   q.validate;
        this.appearingCondition = q.appearingCondition;
        this.questionContent = q.questionContent;
        this.autoAnswer = q.autoAnswer;
        this.options = q.options;
        this.answerType = q.answerType;
        return this;
    }

    setIsRequired(bool: boolean) {
        this.isRequired = bool;
        return this;
    }

    setValidationFunction(func: Function) {
        this.validate = func;
        return this;
    }

    setAppearingCondition(cond: QACondition) {
        this.appearingCondition = cond;
        return this;
    }
    setAutoAnswer(a: QAAutoAnswer) {
        this.autoAnswer = a;
        return this;
    }

    setReferenceId(id: string) {
        this.referenceId = id;
        return this;
    }

    setQuestionContent(content: QAContent) {
        this.questionContent = content;
        return this;
    }

    setCreationDate(creationDate?: number) {
        if (!creationDate) this.creationDate = new Date().getTime();
        else this.creationDate = creationDate
        return this;
    }

    setAutoAnswerEnabled(bool?: Boolean) {
        if (!bool) this.autoAnswer.isEnabled = true
        else this.autoAnswer.isEnabled = bool;
        return this;
    }

    addAutoAnswerCondition(aaCond: QAAnswerCondition) {
        this.autoAnswer.answeringConditions.push(aaCond);
        return this;
    }

    setAnswerType(type: QAValueType) {
        this.answerType = type;
        return this;
    }

    setOptions(opt: AnswerOptions) {
        this.options = opt;
        return this;
    }
}


export interface QAAutoAnswer {
    isEnabled: Boolean,
    answeringConditions: Array<QAAnswerCondition>
}

export interface QAAnswerCondition {
    condition: QACondition,
    ifTrue: QAOption,
    ifFalse: QAOption// or could make a task class
}

export interface AnswerOption {
    value: string,

}