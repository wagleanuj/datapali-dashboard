import { AnswerOptions, IValueType, QuestionSection, QAQuestion, ANSWER_TYPES, QACondition, ILiteral, QAComparisonOperator, QAFollowingOperator } from "dpform";

import React, { ReactElement } from "react";

import _ from "lodash";

import { Radio, RadioGroup } from "react-native-ui-kitten";
import { AnswerStore } from "../answermachine";

interface SelInputProps {
    options: AnswerOptions;
    answerType: IValueType;
    onSelectionChange: (optId: string) => void;
    value?: string;
    definedQuestions: { data: (QuestionSection | QAQuestion), path: number[] }[];
    answerStore: AnswerStore;
    question: QAQuestion;

}
export class SelInput extends React.Component<SelInputProps, any> {
    private allOptionsId: string[]
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (_.isEqual(nextProps, this.props)) {
            return false;
        }
        return true;
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
    evaluateCondition(condition: QACondition, question: QAQuestion) {
        let finalResult = true;
        let pendingOperator = null;
        condition.literals.forEach(literal => {
            const getValid = (item: ILiteral) => {
                let result = true;
                const answer = this.props.answerStore.getById(item.questionRef);
                let c2 = this.transformValueToType(question.answerType, item.comparisonValue.content);
                let c1 = this.transformValueToType(question.answerType, answer);

                if (question) {
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
    filterByCondition() {
        const { groups, rootOptions } = this.props.options.SortedOptions;
        const g = groups.filter(item => this.evaluateCondition(item.appearingCondition, this.props.question));
        const options = rootOptions.filter(item => this.evaluateCondition(item.appearingCondition, this.props.question));
        return { groups: g, rootOptions: options };

    }
    getOptions(): ReactElement[] {
        const { groups, rootOptions } = this.filterByCondition();
        this.allOptionsId = [];
        let returnComp = [];
        const groupItems = groups.map(item => {
            return item.members.map(option => {
                this.allOptionsId.push(option.id);
                return <Radio style={{ paddingBottom: 8, paddingLeft: 8 }} key={item.id} text={option.value} />;
            })

        });
        returnComp = groupItems;
        const groupless = rootOptions.map(item => {
            this.allOptionsId.push(item.id);
            return <Radio style={{ paddingBottom: 8, paddingLeft: 8 }} key={item.id} text={item.value} />
        });
        returnComp.push(...groupless);

        return returnComp;
    }
    onSelectionChanged(index: number) {
        if (this.props.onSelectionChange) this.props.onSelectionChange(this.allOptionsId[index]);
    }
    getDefaultSelected() {
        return this.allOptionsId && this.allOptionsId.findIndex(item => item === this.props.value);
    }
    render() {
        return (
            <RadioGroup selectedIndex={this.getDefaultSelected()} onChange={this.onSelectionChanged.bind(this)}>
                {this.getOptions()}
            </RadioGroup>
        );
    }

}