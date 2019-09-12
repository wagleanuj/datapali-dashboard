import { RootSection, QORS, QuestionSection, QAQuestion, QACondition, IValueType, ANSWER_TYPES, ILiteral, QAComparisonOperator, QAFollowingOperator } from "dpform";
import { TouchableRipple } from "react-native-paper";

export class AnswerMachine {
    private readonly root: RootSection;
    private readonly entries: { data: (QuestionSection | QAQuestion), path: number[] }[];
    private answerStore: Map<string, string> = new Map();
    private currentIndex: number = -1;
    private currentLevelOneSection: QuestionSection;
    constructor(root: RootSection) {
        this.root = root;
        this.entries = this.getAllEntries([0], 0, this.root, null, true);
    }


    transformValueToType(type: IValueType, value: string) {
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

    evaluateCondition(condition: QACondition) {
        let finalResult = true;
        let pendingOperator = null;
        condition.literals.forEach(literal => {
            const getValid = (item: ILiteral) => {
                let result = true;
                const answer = this.answerStore[item.questionRef];
                const question = this.root.questions[item.questionRef];
                console.log(question.id, item.comparisonValue.content, item.comparisonOperator, answer);
                let c2 = this.transformValueToType(question.answerType, item.comparisonValue.content);
                let c1 = this.transformValueToType(question.answerType, answer);

                if (question) {
                    switch (item.comparisonOperator) {
                        case QAComparisonOperator.Equal:
                            result = c1 === c2;
                            console.log(result);
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
                }
                return result;
            }
            let currentResult = getValid(literal);
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
    //returns the next question that can appear as a single page question
    next() {
      
    }

    prev() {

    }

    getQuestion(id: string) {
        return this.root.questions[id];
    }

    getSection(id: string) {
        return this.root.sections[id];
    }

    setAnswer(questionId: string, value: string) {
        this.answerStore.set(questionId, value);
        return this;
    }

    removeAnswer(questionId: string) {
        this.answerStore.delete(questionId);
        return this;
    }

    getAllEntries(startSectionPath: number[], startIndex: number, root: RootSection, fetchType: QORS | null, first: boolean = true, returnbag?: { data: (QuestionSection | QAQuestion), path: number[] }[]) {
        if (!returnbag) returnbag = [];
        if (startSectionPath.length <= 0) return;
        let section = RootSection.getFromPath(startSectionPath, [root]);
        if (!section || !(section instanceof QuestionSection)) return;
        for (let i = startIndex; i < section.content.length; i++) {
            let current = section.content[i];
            if (current instanceof QAQuestion) {
                if (fetchType === QORS.QUESTION || !fetchType) returnbag.push({ path: startSectionPath.concat(i), data: current });

            }
            else if (current instanceof QuestionSection) {
                if (fetchType === QORS.SECTION || !fetchType) returnbag.push({ path: startSectionPath.concat(i), data: current });
                this.getAllEntries(startSectionPath.concat(i), 0, root, fetchType, false, returnbag);
            }
        }
        if (first) {
            let cloned = startSectionPath.slice(0);
            let index = cloned.pop();
            if (typeof (index) === "number") {
                this.getAllEntries(cloned, index, root, fetchType, true, returnbag);
            }
        }
        return returnbag;
    }

}