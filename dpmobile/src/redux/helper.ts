import { ANSWER_TYPES, ILiteral, IValueType, QAComparisonOperator, QACondition, QAFollowingOperator, QAQuestion, QuestionSection, RootSection } from "dpform";
import _ from "lodash";
import { StorageUtil } from "../storageUtil";
import { AnswerState, AppState, AvailableFormsState, FilledFormsState } from "./actions/types";


export function init(section: QuestionSection | RootSection, path: number[], answers: Map<string, Map<string, string>>) {
    const self: any = {
        id: undefined,
        content: undefined,
        _type: section instanceof QuestionSection ? "section" : "root"
    };

    const prepare = (section: QuestionSection | RootSection, path: number[], iteration: number = 0) => {
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
    static generateForm(form) {

    }

    static checkIfQuestionHasCondition(question: QAQuestion) {
        if (question.appearingCondition.literals.length > 0) return true;
        let options = question.options && question.options.SortedOptions;
        let { groups, rootOptions } = options;
        let found = groups.find(item => item.appearingCondition.literals.length > 0);
        if (found) return true;
        if (rootOptions.find(item => item.appearingCondition.literals.length > 0)) return true;
        return false;
    }
    static buildContent2(section: QuestionSection | RootSection, path: number[] = [], as: Map<string, Map<string, string>>, skipDupe: boolean = false): IAnswerSection {
        const prepareSection = (section: QuestionSection | RootSection, path: number[] = [], as: Map<string, Map<string, string>>, iteration: number = 0) => {
            const dupe = Helper.getDuplicatingTimes(section, as);
            const self: IAnswerSection = {
                id: section.id,
                content: [],
                path: path,
                name: section.name
            }
            if (skipDupe || dupe === -1) {
                section.content.forEach((item, index) => {
                    if (!self.content[iteration]) self.content[iteration] = [];

                    if (item instanceof QAQuestion) {
                        self.content[iteration].push({
                            questionId: item.id,
                            answer: undefined,
                            path: path.concat(iteration, index)

                        } as IAnswer)
                    }
                    else if (item instanceof QuestionSection) {
                        self.content[iteration].push(prepareSection(item, path.concat(iteration, index), as))
                    }
                })

            } else {
                for (let i = 0; i < dupe; i++) {
                    section.content.forEach((item, index) => {
                        if (!self.content[i]) self.content[i] = [];
                        if (item instanceof QAQuestion) {
                            self.content[i].push({
                                questionId: item.id,
                                answer: undefined,
                                path: path.concat(i, index)
                            });
                        }
                        else if (item instanceof QuestionSection) {
                            self.content[i].push(prepareSection(item, path.concat(i, index), as))
                        }
                    })
                }
            }
            return self;
        }
        return prepareSection(section, path, as);
    }
    static makeDataForSection(section: QuestionSection, as: Map<string, Map<string, string>>) {
        const dupe = Helper.getDuplicatingTimes(section, as);
        let toReturn: any[] = []
        if (dupe === -1) {
            //collect normally
        }
        else if (dupe > 0) {

        }
        return toReturn;
    }
    static getDuplicatingTimes(item: QuestionSection | RootSection, as: Map<string, Map<string, string>>) {
        if (item instanceof RootSection) return -1;
        if (item.duplicatingSettings.isEnabled) {
            if (item.duplicatingSettings.duplicateTimes.type === 'number') {
                return parseInt(item.duplicatingSettings.duplicateTimes.value);
            } else {
                const ref = (item.duplicatingSettings.duplicateTimes.value);

                const ans = Helper.getValueFromAnswerCache(as, ref);
                console.log('answer of ', ref, ans)
                return 2;
                if (!ans) return 0;
                return parseInt(ans);
            }
        }
        return -1;
    }
    static makePage(root: RootSection, index: number, as: Map<string, Map<string, string>>, container: any[]) {
        const item = root.content[index];
        const sectionContentCollector = (section: QuestionSection, path: number[]) => {
            let con = [];
            section.content.forEach((item, index) => {
                if (item instanceof QuestionSection) {
                    const times = Helper.getDuplicatingTimes(item, as);
                    for (let i = 0; i < times; i++) {
                        con.push(sectionContentCollector(item, path.concat(iteration, index)))
                    }

                }
            })
        };
        let flattened = [];
        if (item instanceof QuestionSection) {
            let times = Helper.getDuplicatingTimes(item, as);
            if (times !== undefined) {

            }

        } else if (item instanceof QAQuestion) {

        }
    }

    static makeTree(root: RootSection | QuestionSection, tree: any = {}) {
        tree[root.id] = _.cloneDeep(root);
        for (let i = 0; i < tree[root.id].content.length; i++) {
            let item = tree[root.id].content[i];
            if (item instanceof QuestionSection) {
                Helper.makeTree(item, tree);
                tree[root.id].childNodes.push(item.id);
            } else if (item instanceof QAQuestion) {
                tree[item.id] = _.cloneDeep(item);
                tree[root.id].childNodes.push(item.id);
            }
        }
        return tree;
    }
    static async generateAppState(): Promise<AppState> {
        const user = await StorageUtil.getUserInfo();
        const rootForms = await StorageUtil.getForms(user.availableForms);
        const filledForms: FilledFormsState = await StorageUtil.getFilledForms(user.filledForms);
        const token = await StorageUtil.getAuthToken();
        const availableForms: AvailableFormsState = rootForms;
        const res: AppState = {

            availableForms: availableForms,
            filledForms: filledForms || {},
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
    static getItemInAnswerSection(section: IAnswerSection, iteration: number, index: number): any {
        return section.content[iteration][index];
    }
    static getAnswerSectionItemFromPath(answerSection: IAnswerSection, path: number[]) {
        if (!path || path.length % 2 !== 0) throw new Error("Should be even");
        if (path.length >= 2) {
            let item = Helper.getItemInAnswerSection(answerSection, path[0], path[1]);
            if (item && item.hasOwnProperty('content') && path.slice(2).length >= 2) {
                return Helper.getAnswerSectionItemFromPath(item, path.slice(2));
            }
            return item;
        } else {
            console.log("invalid path");
        }
    }
    static getValueFromAnswerCache(cache: Map<string, Map<string, string>>, ref: string) {
        const m = cache.get(ref);
        if (!m) {
            return undefined;
        }
        const v = m.entries().next();
        if (!v) {
            return undefined;
        }
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
    static isLiteralValid = (item: ILiteral, answerStore: { [key: string]: string }, questionStore: { [key: string]: QAQuestion }) => {
        let result = true;
        const answer = answerStore[item.questionRef];
        const question = questionStore[item.questionRef]
        if (!question) throw new Error('No question was provided');
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

    static evaluateCondition(condition: QACondition, answerStore: { [key: string]: string }, questionStore: { [key: string]: QAQuestion }) {
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
    static collectDependencies(item: QuestionSection | QAQuestion) {
        let apConditionRef: string[] = [];
        let groupConditionRefs: string[] = [];
        let rootOptionConditionRefs: string[] = [];
        let autoFillConditionRefs: string[] = [];
        let duplicationRef: string = null;
        if (item instanceof QAQuestion) {
            apConditionRef = item.appearingCondition.Literals.map(lit => lit.questionRef);
            item.autoAnswer.answeringConditions.forEach(ac => ac.condition.literals.forEach(item => autoFillConditionRefs.push(item.questionRef)));
            let { groups, rootOptions } = item.options.SortedOptions;
            groups.forEach(group => group.appearingCondition.Literals.forEach(lit => groupConditionRefs.push(lit.questionRef)));
            rootOptions.forEach(opt => opt.appearingCondition.Literals.forEach(lit => rootOptionConditionRefs.push(lit.questionRef)));
        } else if (item instanceof QuestionSection) {
            apConditionRef = item.appearingCondition.Literals.map(lit => lit.questionRef);
            duplicationRef = item.duplicatingSettings.isEnabled && item.duplicatingSettings.duplicateTimes.type === 'questionRef' ? item.duplicatingSettings.duplicateTimes.value : null;
        }
        let ns = new Set([].concat(apConditionRef, groupConditionRefs, rootOptionConditionRefs, duplicationRef?[duplicationRef]:[]));
        return {
            all: Array.from(ns),
            autoFillConditions: Array.from(new Set(apConditionRef)),
            groupConditions: Array.from(new Set(groupConditionRefs)),
            rootOptionConditions: Array.from(new Set(rootOptionConditionRefs)),
            duplicationRef: duplicationRef
        };
    }

    static makeFormData(section: QuestionSection, path: number[] = [0, 0], valueLocationName?: string) {
        if (!valueLocationName) valueLocationName = section.id;
        let content = [];
        let duplicateTimes = 1;
        let dependency = Helper.collectDependencies(section);
        for (let i = 0; i < duplicateTimes; i++) {
            let sectionItem = {
                title: section.name + (duplicateTimes > 1 ? " " + (i + 1) : ''),
                id: section.id,
                path: path.concat(i),
                content: [],
                dependency: dependency,
            }
            section.content.forEach((item, index) => {
                if (item instanceof QuestionSection) {
                    sectionItem.content.push(Helper.makeFormData(item, path.concat(i, index), valueLocationName.concat(`[${i}].${item.id}`)));
                } else if (item instanceof QAQuestion) {
                    sectionItem.content.push({
                        id: item.id,
                        title: item.questionContent.content,
                        valueLocationName: valueLocationName.concat('[', i.toString(), ']', '.', item.id),
                        path: path.concat(i, index),
                        answerType: item.answerType,
                        isRequired: item.isRequired,
                        isDependent: Helper.checkIfQuestionHasCondition(item),
                        dependency: Helper.collectDependencies(item)
                    })
                }
            })
            content.push(sectionItem);
        }
        return content;
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
    name?: string;
    content: Array<Array<IAnswer | IAnswerSection>>
}