import { IContent, QAType } from './answer';
import { AnswerOptions } from './AnswerOptions';
import { QACondition } from './condition';
import { IValueType } from './valueType';
export declare class QAQuestion {
    id: string;
    isRequired: boolean;
    appearingCondition: QACondition;
    questionContent: IContent;
    creationDate: number;
    autoAnswer: IAutoAnswer;
    options: AnswerOptions;
    answerType: IValueType;
    content: never[];
    customId: string;
    constructor();
    static toJSON(a: QAQuestion): {
        id: string;
        isRequired: boolean;
        appearingCondition: {
            [key: string]: any;
        } | undefined;
        questionContent: {
            content: string;
            type: QAType;
        };
        autoAnswer: {
            isEnabled: boolean;
            answeringConditions: {
                condition: {
                    [key: string]: any;
                } | undefined;
                ifTrue: string | undefined;
                ifFalse: string | undefined;
            }[];
        } | undefined;
        options: {
            optionsMap: {
                [x: string]: {
                    appearingCondition: {
                        [key: string]: any;
                    } | undefined;
                    type: {
                        [key: string]: any;
                    } | undefined;
                    id: string;
                    value: string | undefined;
                    groupName: string | undefined;
                };
            };
            optionGroupMap: {
                [x: string]: {
                    id: string;
                    name: string;
                    appearingCondition: {
                        [key: string]: any;
                    } | undefined;
                    members: {
                        appearingCondition: {
                            [key: string]: any;
                        } | undefined;
                        type: {
                            [key: string]: any;
                        } | undefined;
                        id: string;
                        value: string | undefined;
                        groupName: string | undefined;
                    }[];
                };
            };
        };
        answerType: {
            [key: string]: any;
        } | undefined;
        customId: string;
    };
    static fromJSON(a: any): QAQuestion;
    updateFromQuestion(q: QAQuestion): this;
    setIsRequired(bool: boolean): this;
    setAppearingCondition(cond: QACondition): this;
    setAutoAnswer(a: IAutoAnswer): this;
    setQuestionContent(content: IContent): this;
    setCreationDate(creationDate?: number): this;
    setAutoAnswerEnabled(bool?: boolean): this;
    addAutoAnswerCondition(aaCond: IAnswerCondition): this;
    setAnswerType(type: IValueType): this;
    setOptions(opt: AnswerOptions): this;
}
export interface IAutoAnswer {
    isEnabled: boolean;
    answeringConditions: Array<IAnswerCondition>;
}
export interface IAnswerCondition {
    condition: QACondition;
    ifTrue: string | undefined;
    ifFalse: string | undefined;
}
export interface IAnswerOption {
    value: string;
}
export declare function answerConditionToJSON(a: IAnswerCondition): {
    condition: {
        [key: string]: any;
    } | undefined;
    ifTrue: string | undefined;
    ifFalse: string | undefined;
};
export declare function answerConditionFromJSON(a: any): IAnswerCondition;
export declare function autoAnswerToJSON(a: IAutoAnswer): {
    isEnabled: boolean;
    answeringConditions: {
        condition: {
            [key: string]: any;
        } | undefined;
        ifTrue: string | undefined;
        ifFalse: string | undefined;
    }[];
} | undefined;
export declare function autoAnswerFromJSON(a: any): IAutoAnswer;
