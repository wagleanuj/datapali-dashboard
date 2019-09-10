import React from "react";
import { Table, Button } from "reactstrap";
import { QACondition } from "../form/condition";
import { ILiteral } from "../form/answer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openModal, destroyModal } from "../form/util";
import { CreateConditionModal } from "./CreateConditionModal";
import { getRandomId } from "../utils/getRandomId";
import _ from "lodash";
import { faKey, faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { IAnswerCondition, QAQuestion, IAutoAnswer } from "../form/question";
import { ValInput } from "./ValInput";
import { AnswerOptions } from "../form/AnswerOptions";
import { Switch } from "@blueprintjs/core";
import { IValueType, ANSWER_TYPES } from "../form";

interface AutoAnswerProps {
    definedQuestions: { [key: string]: QAQuestion },
    onChange: (a: IAutoAnswer) => void,
    options?: AnswerOptions,
    answerType: IValueType,
    autoAnswer: IAutoAnswer
}
interface AutoAnswerState {
    aConditions: IAnswerCondition[];
    isEnabled: boolean,
}

export class AutofillCondition extends React.Component<AutoAnswerProps, AutoAnswerState> {
    constructor(props: AutoAnswerProps) {
        super(props);
        this.state = {
            aConditions: this.props.autoAnswer.answeringConditions || [],
            isEnabled: this.props.autoAnswer.isEnabled
        }
    }

    editIfTrueFalseValue(type: string, index: number, value: string) {
        this.setState((prevState: AutoAnswerState) => {
            let found = undefined;
            let newConditions = _.clone(prevState.aConditions);
            let selected = newConditions[index];
            if (this.props.options && this.props.answerType.name === ANSWER_TYPES.SELECT) {
                found = this.props.options.optionsMap[value];
                if (type === "true") {
                    selected.ifTrue = found.id

                }
                else if (type === "false") {
                    selected.ifFalse = found.id
                }
            }
            else {
                if (type === 'true') selected.ifTrue = value;
                if (type === 'false') selected.ifFalse = value;
            }



            return {
                aConditions: newConditions
            }
        }, () => {
            if (this.props.onChange) {
                this.props.onChange({ isEnabled: this.state.isEnabled, answeringConditions: this.state.aConditions })
            }
        });

    }


    openConditionModal(index: number) {
        let condition: IAnswerCondition = this.state.aConditions[index];

        let el = <CreateConditionModal
            definedQuestions={this.props.definedQuestions}
            isOpen={true}
            onSubmit={this.editCondition.bind(this, index)}
            onCancel={destroyModal.bind(this)}
            condition={condition.condition} />
        openModal(el);
    }
    changeEnabled() {
        this.setState((prevState: AutoAnswerState) => {
            return {
                isEnabled: !prevState.isEnabled
            }
        }, () => {
            if (this.props.onChange)
                this.props.onChange({ isEnabled: this.state.isEnabled, answeringConditions: this.state.aConditions })

        })
    }

    addAutoFillCondition() {
        this.setState((prevState: AutoAnswerState) => {
            let newConditions = _.clone(prevState.aConditions);
            let answerCondition: IAnswerCondition = {
                condition: new QACondition(),
                ifTrue: undefined,
                ifFalse: undefined
            }
            newConditions.push(answerCondition);
            return {
                aConditions: newConditions
            }
        }, () => {
            if (this.props.onChange)
                this.props.onChange({ isEnabled: this.state.isEnabled, answeringConditions: this.state.aConditions })
        })
    }

    editCondition(index: number, data: ILiteral[]) {
        let cloned = _.clone(this.state.aConditions);
        let condition = cloned[index].condition;
        if (!condition) {
            cloned[index].condition = new QACondition();
        }
        cloned[index].condition.setLiterals(data);
        this.setState({
            aConditions: cloned
        }, () => {
            destroyModal();
            if (this.props.onChange) this.props.onChange({ isEnabled: this.state.isEnabled, answeringConditions: this.state.aConditions })

        })
    }

    removeAutofillCondition(index: number) {
        this.setState((prevState: AutoAnswerState) => {
            let aConditions = _.clone(prevState.aConditions);
            aConditions.splice(index, 1);
            return {
                aConditions: aConditions
            }

        }, () => {
            if (this.props.onChange) this.props.onChange({ isEnabled: this.state.isEnabled, answeringConditions: this.state.aConditions })

        })
    }


    render() {

        return (
            <div>
                <Switch checked={this.state.isEnabled} onChange={this.changeEnabled.bind(this)} label="Enabled"></Switch>
                <Table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Condition</th>
                            <th> if True</th>
                            <th> if False</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.aConditions.map((item: IAnswerCondition, index: number) => {

                            let comparisonValueSelect = (ifFalseOrTrue: string) => <ValInput
                                key={ifFalseOrTrue}
                                onChange={(data: { value: string }) => this.editIfTrueFalseValue(ifFalseOrTrue, index, data.value)}
                                options={this.props.options}
                                defaultValue={ifFalseOrTrue === "true" ? item.ifTrue : (item.ifFalse && item.ifFalse)}
                                type={this.props.answerType} />

                            return (<tr key={`af${index}`}>
                                <td></td>
                                <td><Button type="button" onClick={() => this.openConditionModal(index)}
                                    size="sm">
                                    <FontAwesomeIcon size={"sm"} icon={faKey} /></Button>
                                </td>
                                <td>{comparisonValueSelect("true")}</td>
                                <td>{comparisonValueSelect("false")}</td>
                                <td><Button size="sm" onClick={() => { this.removeAutofillCondition(index) }}> <FontAwesomeIcon icon={faWindowClose} /></Button></td>
                            </tr>)
                        })}
                        <tr>
                            <td ><Button size="sm" onClick={() => this.addAutoFillCondition()} type="button" >
                                <FontAwesomeIcon icon={faPlusSquare} />
                            </Button></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                    </tbody>
                </Table>
            </div>
        )
    }
}
