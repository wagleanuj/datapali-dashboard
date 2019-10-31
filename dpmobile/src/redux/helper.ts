import { ANSWER_TYPES, ILiteral, IValueType, QAComparisonOperator, QACondition, QAFollowingOperator, QAQuestion, QuestionSection } from "dpform";


export class Helper {

    static checkIfQuestionHasCondition(question: QAQuestion | any) {
        if (question.appearingCondition.literals.length > 0) return true;
        let options = question.options && question.options.SortedOptions;
        let { groups, rootOptions } = options;
        let found = groups.find(item => item.appearingCondition.literals.length > 0);
        if (found) return true;
        if (rootOptions.find(item => item.appearingCondition.literals.length > 0)) return true;
        return false;
    }

 

    static makeTree(root: any, tree: any = {}) {
        tree[root.id] = { ...root, childNodes: [], _type: root instanceof QuestionSection ? 'section' : 'root' };
        tree[root.id].childNodes = [];
        for (let i = 0; i < tree[root.id].content.length; i++) {
            let item = tree[root.id].content[i];
            if (item.hasOwnProperty('content')) {
                Helper.makeTree(item, tree);
                tree[root.id].childNodes.push(item.id);
            } else {
                tree[item.id] = { ...item, _type: 'question' }
                tree[root.id].childNodes.push(item.id);
            }
        }
        delete tree[root.id].content;
        return tree;
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

    static isLiteralValid = (item: ILiteral, answerStore: { [key: string]: string }, questionStore: { [key: string]: QAQuestion | any }) => {
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

    static evaluateCondition(condition: QACondition, answerStore: { [key: string]: string }, questionStore: { [key: string]: QAQuestion | any }) {
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

    static findValue(values, ref) {
        if (!values) return undefined;
        let keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let curr = values[key];
            if (Array.isArray(curr)) {
                let val = Helper.findValue(curr[curr.length - 1], ref);
                if (val) return val;
            } else {
                if (key === ref) {
                    return curr;
                }
            }
        }
        return undefined;
    }
    static getProgress(counts) {
        let filled = 0;
        let required = 0;
        Object.keys(counts).forEach((key) => {
            const c = counts[key];
            filled += c.filled;
            required += c.required;
        })
        return filled / required;
    }
    static getDupeTimes(settings, values) {
        if (!settings) return -1;
        if (!settings.isEnabled) return -1;
        else {
            let times = settings.duplicateTimes;

            if (times.type === 'number') {
                return parseInt(times.value);
            }
            else {
                let ref = times.value;

                let value = Helper.findValue(values, ref);
                if (value) {
                    return parseInt(value)
                } else {
                    return 0;
                }

            }
        }
    }
    static collectDependencies(item: QuestionSection | QAQuestion) {
        let apConditionRef: string[] = [];
        let groupConditionRefs: string[] = [];
        let rootOptionConditionRefs: string[] = [];
        let autoFillConditionRefs: string[] = [];
        let duplicationRef: string = null;
        if (item instanceof QAQuestion || item._type === 'question') {
            const hasAppearingCondition = item && item.appearingCondition && item.appearingCondition.literals;
            apConditionRef = hasAppearingCondition ? item.appearingCondition.literals.map(lit => lit.questionRef) : undefined;
            item.autoAnswer.answeringConditions.forEach(ac => ac.condition.literals.forEach(item => autoFillConditionRefs.push(item.questionRef)));
            const rootOptions = Object.values(item.options.optionsMap).filter(item => !item.groupName);
            const groups = Object.values(item.options.optionGroupMap);
            groups.forEach(group => group.appearingCondition && group.appearingCondition.literals.forEach(lit => groupConditionRefs.push(lit.questionRef)));
            rootOptions.forEach(opt => opt.appearingCondition && opt.appearingCondition.literals.forEach(lit => rootOptionConditionRefs.push(lit.questionRef)));
        } else if (item instanceof QuestionSection || item._type === 'section') {
            const hasAppearingCondition = item && item.appearingCondition && item.appearingCondition.literals;
            apConditionRef = hasAppearingCondition ? item.appearingCondition.literals.map(lit => lit.questionRef) : undefined;
            duplicationRef = item.duplicatingSettings.isEnabled && item.duplicatingSettings.duplicateTimes.type === 'questionRef' ? item.duplicatingSettings.duplicateTimes.value : null;
        }
        let ns = new Set([].concat(apConditionRef, groupConditionRefs, rootOptionConditionRefs, duplicationRef ? [duplicationRef] : []));
        return {
            all: Array.from(ns),
            autoFillConditions: Array.from(new Set(apConditionRef)),
            groupConditions: Array.from(new Set(groupConditionRefs)),
            rootOptionConditions: Array.from(new Set(rootOptionConditionRefs)),
            duplicationRef: duplicationRef
        };
    }




}

