import { ANSWER_TYPES, ILiteral, IValueType, QAComparisonOperator, QACondition, QAFollowingOperator, QAQuestion, QuestionSection, RootSection, Answer } from "dpform";
import { StorageUtil } from "../storageUtil";
import { AnswerState, AppState, AvailableFormsState, FilledFormsState } from "./actions/types";
import { AnswerSection } from "../answer.store";


export function init(section: QuestionSection | RootSection, path: number[]) {
    const self: any = {
        id: undefined,
        content: undefined,
        _type: section instanceof QuestionSection ? "section" : "root"
    };

    const prepare = (section: QuestionSection | RootSection, path: number[]) => {
        let placeholder = [];
        section.content.forEach((item, index) => {
            if (item instanceof QuestionSection) {
                placeholder.push(init(item, path.concat(0, index)));
            } else if (item instanceof QAQuestion) {
                placeholder.push({
                    ...QAQuestion.toJSON(item),
                    _type: "question",
                    answer: undefined,
                    path: path.concat(path.concat(0, index))
                });
            }
        });
        return placeholder;
    }
    self.id = section.id;
    self.content = [];
    self.path = path;
    if (section instanceof QuestionSection) {
        self.duplicatingSettings = section.duplicatingSettings
        self.appearingCondition = section.appearingCondition;
    }
    self.content[0] = prepare(section, [0, 0]);
    return { self };
}

export class Helper {
    static async generateAppState(): Promise<AppState> {
        const user = await StorageUtil.getUserInfo();
        const rootForms = await StorageUtil.getForms(user.availableForms);
        const filledForms: FilledFormsState = await StorageUtil.getFilledForms(user.filledForms);
        const token = await StorageUtil.getAuthToken();
        const availableForms: AvailableFormsState = rootForms;
        const res: AppState = {
            availableForms: availableForms,
            filledForms: filledForms,
            user: {
                availableForms: user.availableForms,
                filledForms: user.filledForms,
                firstName: user.firstName,
                id: user.userID,
                lastName: user.lastName,
                token: token,
            }
        }
        return res;
    }
    static getAnswerById(store: AnswerState, id: string, path?: number[]): { path: number[], value: string }[] {
        const m = store.answers.get(id);
        if (!m) return [];
        if (path) return [{ path: path, value: m.get(path.join(".")) }];
        let returnv = [];
        m.forEach((value, key) => {
            returnv.push({ path: key.split('.').map(i => parseInt(i)), value: value });
        });
        return returnv;
    }
    static transformValueToType(type: IValueType, value: string) {
        switch (type.name) {
            case ANSWER_TYPES.BOOLEAN:
                return Boolean(value);
            case ANSWER_TYPES.DATE:
                return new Date(value);
            case ANSWER_TYPES.NUMBER:
                return parseFloat(value);
            case ANSWER_TYPES.STRING:
                return value;
            case ANSWER_TYPES.TIME:
                return new Date(value);
        }
        return value;
    }
    static isLiteralValid = (item: ILiteral, answerStore: AnswerState, questionStore: Map<string, QAQuestion>) => {
        let result = true;
        const answers = Helper.getAnswerById(answerStore, item.questionRef);
        const answer = answers[0] ? answers[0].value : undefined;
        const question = questionStore.get(item.questionRef);
        if (!question) throw new Error("question store does not have the referred question");
        let c2 = Helper.transformValueToType(question.answerType, item.comparisonValue.content);
        let c1 = Helper.transformValueToType(question.answerType, answer);

        switch (item.comparisonOperator) {
            case QAComparisonOperator.Equal:
                result = c1 === c2;
                break;
            case QAComparisonOperator.Greater_Than:
                result = c1 > c2;
                break;
            case QAComparisonOperator.Greater_Than_Or_Equal:
                result = c1 >= c2;
                break;
            case QAComparisonOperator.Less_Than:
                result = c1 < c2;
                break;
            case QAComparisonOperator.Less_Than_Or_Equal:
                result = c1 >= c2;
                break;
        }

        return result;
    }

    static evaluateCondition(condition: QACondition, answerStore: AnswerState, questionStore: Map<string, QAQuestion>) {
        let finalResult = true;
        let pendingOperator = null;
        if (!condition) return finalResult;
        condition.literals && condition.literals.forEach(literal => {

            let currentResult = Helper.isLiteralValid(literal, answerStore, questionStore);
            if (!pendingOperator) {
                finalResult = currentResult;
                pendingOperator = literal.followingOperator
            }
            else if (pendingOperator) {
                switch (pendingOperator) {
                    case QAFollowingOperator.AND:
                        finalResult = finalResult && currentResult;
                        break;
                    case QAFollowingOperator.OR:
                        finalResult = finalResult || currentResult;
                        break;
                }
            }

        });
        return finalResult;
    }

    static buildContent(section: QuestionSection | RootSection, path: number[] = []): IAnswerSection {
        const self: IAnswerSection = {
            content: [],
            id: section.id,
            path: []
        }
        const prepare = (section: QuestionSection | RootSection, path: number[]): Array<IAnswer | IAnswerSection> => {
            let placeholder: Array<IAnswer | IAnswerSection> = [];
            section.content.forEach((item, index) => {
                if (item instanceof QuestionSection) {
                    placeholder.push(Helper.buildContent(item, path.concat(0, index)));
                } else {
                    const ans: IAnswer = {
                        path: path.concat(0, index),
                        answer: undefined,
                        questionId: item.id
                    }
                    placeholder.push(ans);
                }
            });
            return placeholder;
        };
        self.content = [prepare(section, path)];
        self.path = path;
        return self;

    }

}

export interface IAnswer {
    path: number[]
    questionId: string;
    answer: string;
}
export interface IAnswerSection {
    id: string;
    path: number[];
    content: Array<Array<IAnswer | IAnswerSection>>
}