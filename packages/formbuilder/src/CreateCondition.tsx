import { Button, Card, HTMLTable } from "@blueprintjs/core";
import { IAnswerOption, IContent, ILiteral, QAComparisonOperator, QACondition, QAFollowingOperator, QAQuestion, QAType } from "@datapali/dpform";
import _ from "lodash";
import React from "react";
import Select from 'react-select';
import { ValueType } from "react-select/src/types";
import { customStyles, getOperatorForType, ISelectOption } from "./DPFormItem";
import { getRandomId } from "./utils/getRandomId";
import { ValInput } from "./ValInput";

enum TableFieldType {
    QuestionRef = 1,
    ComparisonOperator,
    ComparisonValue,
    FollowingOperator,
}


type CreateConditionState = {
    literals: ILiteral[]
};

type CreateConditionProps = {
    definedQuestions?: { [key: string]: QAQuestion }
    onChange?: (data: ILiteral[]) => void
    literals?: Array<ILiteral>
    setLiteralsSetter?: Function
    condition?: QACondition
}

export class CreateCondition extends React.Component<CreateConditionProps, CreateConditionState> {
    columns: {
        dataField: string;
        text: string;
    }[];
    static get defaultProps(): CreateConditionProps {
        return {
            onChange: () => { },
        }
    };
    constructor(props: CreateConditionProps) {
        super(props);
        this.state = {
            literals: this.props.condition ? this.props.condition.literals : [],
        };
        this.columns = [
            {
                dataField: "id",
                text: "Literal ID"
            },
            {
                dataField: "questionRef",
                text: "Question Reference"
            },
            {
                dataField: "comparisonOperator",
                text: "Comparison Operator"
            },
            {
                dataField: "comparisonValue",
                text: "Comparison Value"
            },
            {
                dataField: "followingOperator",
                text: "Following Operator"
            }
        ];
    }
    componentDidMount() {
        if (this.props.setLiteralsSetter) {
            this.props.setLiteralsSetter(this.setLiterals.bind(this));
        }
    }
    setLiterals(newLiterals: ILiteral[]) {
        this.setState({
            literals: newLiterals
        });
    }
    addLiteral(literal?: ILiteral) {
        if (!literal)
            literal = { literalId: getRandomId("lit-"), questionRef: undefined, comparisonOperator: undefined, comparisonValue: undefined, followingOperator: undefined };

        this.setState((prevState: CreateConditionState) => {
            let newLiterals = _.clone(prevState.literals);
            if (literal) newLiterals.push(literal);
            return { literals: newLiterals };
        }, () => {
            if (this.props.onChange) {

                this.props.onChange(this.state.literals);
            }
        });
    }
    moveLiteralUp(index: number) {
        this.setState((prevState: CreateConditionState) => {
            let newLiterals = _.clone(prevState.literals);
            const get_new_index = (i: number, length: number) => {
                const mod = (x: number, n: number) => (x % n + n) % n;
                return mod(i - 1, length);
            };
            let newIndex = get_new_index(index, newLiterals.length);
            [newLiterals[index], newLiterals[newIndex]] = [newLiterals[newIndex], newLiterals[index]];
            return {
                literals: newLiterals
            };
        }, this.forceUpdate.bind(this));
    }
    handleDataChange(literalIndex: number, valueField: TableFieldType, newValue: any) {
        this.setState((prevState: CreateConditionState) => {
            let newLiterals: ILiteral[] = _.clone(prevState.literals);
            let current = newLiterals[literalIndex];
            switch (valueField) {
                case TableFieldType.QuestionRef:
                    current.questionRef = newValue && newValue.value ? newValue.value : undefined;
                    break;
                case TableFieldType.ComparisonOperator:
                    let prop: keyof typeof QAComparisonOperator;
                    let accessProp: keyof typeof QAComparisonOperator;
                    for (prop in QAComparisonOperator) {
                        if (QAComparisonOperator[prop] === newValue.value) {
                            accessProp = prop;
                            current.comparisonOperator = QAComparisonOperator[accessProp];
                            break;
                        }
                    }
                    break;
                case TableFieldType.ComparisonValue:
                    let newComparisonValue: IContent = { content: newValue.value, type: QAType.String };
                    current.comparisonValue = newComparisonValue;
                    break;
                case TableFieldType.FollowingOperator:
                    current.followingOperator = (newValue.value === QAFollowingOperator.AND) ? QAFollowingOperator.AND : QAFollowingOperator.OR;
                    break;
                default:
                    break;
            }
            return {
                literals: newLiterals
            };
        }, () => {
            if (this.props.onChange)
                this.props.onChange(this.state.literals);
        });
    }
    getQuestion(questionRef?: string) {
        if (questionRef && this.props.definedQuestions && !_.isEmpty(this.props.definedQuestions)) {
            let v = this.props.definedQuestions[questionRef];
            return v;
        }
        return null;
    }
    removeLiteral(index: number) {
        this.setState((prevState: CreateConditionState) => {
            let newLiterals = _.clone(prevState.literals);
            newLiterals.splice(index, 1);
            return {
                literals: newLiterals
            };
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.literals);
            }
        });
    }
    render() {
        return (<>
            <HTMLTable>
                <thead>
                    <tr>
                        <th key="th-first">{``}</th>
                        {this.columns.map((item, key) => {
                            return <th key={key}>{item.text}</th>;
                        })}
                        <th key="th-last">{``}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.literals.map((item: ILiteral, key: number) => {
                        let questions_ = this.props.definedQuestions ? Object.values(this.props.definedQuestions).map((item: QAQuestion) => ({ value: item.id, label: item.questionContent.content })) : [];
                        let questionselect = <Select key={`literalq-${key}-${item.literalId}`} styles={customStyles} options={questions_} value={questions_.find((r: { value: string, label: string }) => r.value === item.questionRef)} onChange={(selecteOption: ValueType<IAnswerOption>) => this.handleDataChange(key, TableFieldType.QuestionRef, selecteOption)} />;
                        let selectedQuestionType = item.questionRef && this.props.definedQuestions && this.props.definedQuestions[item.questionRef] ? this.props.definedQuestions[item.questionRef].answerType : undefined;
                        let comparisionOPOptions_: ISelectOption[] = getOperatorForType(selectedQuestionType).map((val, index) => ({ value: val, label: val }));
                        let comparisonOpSelect = <Select key={`literalo-${key}-${item.literalId}`} styles={customStyles} options={comparisionOPOptions_} value={comparisionOPOptions_.find((op, index) => op.value === item.comparisonOperator)} onChange={this.handleDataChange.bind(this, key, TableFieldType.ComparisonOperator)} />;
                        let question_: QAQuestion | null = this.getQuestion(item.questionRef);
                        let qAnswerType = question_ ? question_.answerType : undefined;
                        let qOptions = question_ && question_.options ? question_.options : undefined;
                        let comparisonValueSelect = <ValInput options={qOptions} key={`literalv-${key}-${item.literalId}`} onChange={this.handleDataChange.bind(this, key, TableFieldType.ComparisonValue)} defaultValue={item.comparisonValue && item.comparisonValue.content} type={qAnswerType} />;
                        let followingOperatorOptions_: ISelectOption[] = Object.keys(QAFollowingOperator).map((key) => ({ label: key, value: key === "AND" ? QAFollowingOperator.AND : key === "OR" ? QAFollowingOperator.OR : "" }));
                        let followingOperatorSelect = <Select key={`literalfo-${key}-${item.literalId}`} styles={customStyles} options={followingOperatorOptions_} value={followingOperatorOptions_.find(r => r.value === item.followingOperator)} onChange={this.handleDataChange.bind(this, key, TableFieldType.FollowingOperator)} />;
                        return <tr key={"tr_" + key}>
                            <td><Button icon="arrow-up" onClick={() => this.moveLiteralUp(key)} /></td>
                            <td>l<sub>{key}</sub></td>
                            <td className="questionRef">{questionselect}</td>
                            <td className="comparisonOperator">{comparisonOpSelect}</td>
                            <td className="comparisonValue">{comparisonValueSelect}</td>
                            <td className="followingOperator">{followingOperatorSelect}</td>
                            <td><Button icon="cross" onClick={() => { this.removeLiteral(key); }} /></td>
                        </tr>;
                    })}
                    <tr>
                        <td><Button onClick={() => this.addLiteral()} icon="plus" /></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                    </tr>

                </tbody>
            </HTMLTable>

        </>);
    }
}
