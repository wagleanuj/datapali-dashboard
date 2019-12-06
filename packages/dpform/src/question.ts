import { IContent, QAType } from './answer';
import { AnswerOptions } from './AnswerOptions';
import { QACondition } from './condition';
import { getRandomId } from './util';
import { answerTypeFromJSON, answerTypeToJSON, IValueType } from './valueType';
export class QAQuestion {
    id!: string;
    isRequired!: boolean;
    appearingCondition!: QACondition;
    questionContent!: IContent;
    creationDate!: number;
    autoAnswer!: IAutoAnswer;
    options!: AnswerOptions;
    answerType!: IValueType;
    content = [];
    customId: string = '';

    constructor() {
        this.autoAnswer = {
            isEnabled: false,
            answeringConditions: [],
        };
        this.options = new AnswerOptions();
        this.id = getRandomId('q-');
        this.questionContent = { content: '', type: QAType.String };
    }

    static toJSON(a: QAQuestion) {
        const r = {
            id: a.id,
            isRequired: a.isRequired,
            appearingCondition: QACondition.toJSON(a.appearingCondition),
            questionContent: { content: a.questionContent.content, type: a.questionContent.type },
            autoAnswer: autoAnswerToJSON(a.autoAnswer),
            options: AnswerOptions.toJSON(a.options),
            answerType: a.answerType ? answerTypeToJSON(a.answerType) : undefined,
            customId: a.customId
        };
        return r;
    }
    static fromJSON(a: any): QAQuestion {
        const q = new QAQuestion();
        q.id = a.id;
        q.isRequired = a.isRequired;
        q.appearingCondition = QACondition.fromJSON(a.appearingCondition);
        q.questionContent = a.questionContent as IContent;
        if (a.options) { q.options = AnswerOptions.fromJSON(a.options); }
        if (a.answerType) { q.answerType = answerTypeFromJSON(a.answerType); }
        if (a.autoAnswer) { q.autoAnswer = autoAnswerFromJSON(a.autoAnswer); }
        q.customId = a.customId || "";
        return q;
    }

    updateFromQuestion(q: QAQuestion) {
        this.isRequired = q.isRequired;
        this.appearingCondition = q.appearingCondition;
        this.questionContent = q.questionContent;
        this.autoAnswer = q.autoAnswer;
        this.options = q.options;
        this.answerType = q.answerType;
        this.customId = q.customId;
        this.id = q.id;
        return this;
    }

    setIsRequired(bool: boolean) {
        this.isRequired = bool;
        return this;
    }


    setAppearingCondition(cond: QACondition) {
        this.appearingCondition = cond;
        return this;
    }
    setAutoAnswer(a: IAutoAnswer) {
        this.autoAnswer = a;
        return this;
    }

    setQuestionContent(content: IContent) {
        this.questionContent = content;
        return this;
    }

    setCreationDate(creationDate?: number) {
        if (!creationDate) { this.creationDate = new Date().getTime(); } else { this.creationDate = creationDate; }
        return this;
    }

    setAutoAnswerEnabled(bool?: boolean) {
        if (!bool) { this.autoAnswer.isEnabled = true; } else { this.autoAnswer.isEnabled = bool; }
        return this;
    }

    addAutoAnswerCondition(aaCond: IAnswerCondition) {
        this.autoAnswer.answeringConditions.push(aaCond);
        return this;
    }

    setAnswerType(type: IValueType) {
        this.answerType = type;
        return this;
    }

    setOptions(opt: AnswerOptions) {
        this.options = opt;
        return this;
    }
}

export interface IAutoAnswer {
    isEnabled: boolean;
    answeringConditions: Array<IAnswerCondition>;
}

export interface IAnswerCondition {
    condition: QACondition;
    ifTrue: string | undefined;
    ifFalse: string | undefined; // or could make a task class
}

export interface IAnswerOption {
    value: string;
}

export function answerConditionToJSON(a: IAnswerCondition) {
    return ({
        condition: QACondition.toJSON(a.condition),
        ifTrue: (a.ifTrue),
        ifFalse: (a.ifFalse),
    });
}



export function answerConditionFromJSON(a: any): IAnswerCondition {
    const r: IAnswerCondition = {
        condition: QACondition.fromJSON(a.condition),
        ifFalse: a.ifFalse,
        ifTrue: a.ifTrue,
    };
    return r;
}



export function autoAnswerToJSON(a: IAutoAnswer) {
    if (!a) { return undefined; }
    return ({
        isEnabled: a.isEnabled,
        answeringConditions: a.answeringConditions.map(item => answerConditionToJSON(item)),
    });
}

export function autoAnswerFromJSON(a: any) {
    const r: IAutoAnswer = {
        isEnabled: a.isEnabled,
        answeringConditions: a.answeringConditions.map((item: any) => answerConditionFromJSON(item)),
    };
    return r;

}
