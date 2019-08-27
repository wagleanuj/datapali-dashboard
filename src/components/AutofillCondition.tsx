import React from "react";
import { Table, Button } from "reactstrap";
import { QACondition } from "../form/condition";
import { AnswerType, QALiteral } from "../form/answer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openModal, destroyModal } from "../utils/util";
import { CreateConditionModal, ValueInput } from "./DPFormItem";
import { getRandomId } from "../utils/getRandomId";
import _ from "lodash";
import { faKey, faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { QAAnswerCondition } from "../form/question";

export class AutofillCondition extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            aConditions: [],
            isEnabled: true
        }
    }

    editIfTrueFalseValue(type: string, index: number, value: string | number | boolean) {
        this.setState((prevState: any) => {
            let newConditions = _.clone(prevState.aConditions);
            let selected = newConditions[index];
            if (type === "true") {
                selected.ifTrue = value

            }
            else if (type === "false") {
                selected.ifFalse = value
            }
            return {
                aConditions: newConditions
            }
        }, () => {
            if (this.props.onChange) {
                this.props.onChange({ isEnabled: this.state.isEnabled, answerCondition: this.state.aConditions })
            }
        });

    }


    openConditionModal(index: number) {
        let condition: QAAnswerCondition = this.state.aConditions[index];

        let el = <CreateConditionModal
            isOpen={true}
            onSubmit={this.editCondition.bind(this, index)}
            onCancel={destroyModal.bind(this)}
            condition={condition.condition} />
        openModal(el);
    }

    addAutoFillCondition() {
        this.setState((prevState: any) => {
            let newConditions = _.clone(prevState.aConditions);
            newConditions.push({
                condition: new QACondition(),
                ifTrue: undefined,
                ifFalse: undefined
            } as unknown as QAAnswerCondition)
            return {
                aConditions: newConditions
            }
        }, () => {
            if (this.props.onChange)
                this.props.onChange({ isEnabled: this.state.isEnabled, answerCondition: this.state.aConditions })
        })
    }

    editCondition(index: number, data: QALiteral[]) {
        let cloned = _.clone(this.state.aConditions);
        let condition = cloned[index].condition;
        if (!condition) {
            cloned[index].conditin = new QACondition();
        }
        cloned[index].condition.setLiterals(data);
        this.setState({
            aConditions: cloned
        }, () => {
            destroyModal();
            if (this.props.onchange) this.props.onChange({ isEnabled: this.state.isEnabled, answerCondition: this.state.aConditions })

        })
    }

    removeAutofillCondition(index: number) {
        this.setState((prevState: any) => {
            let aConditions = _.clone(prevState.aConditions);
            aConditions.splice(index, 1);
            return {
                aConditions: aConditions
            }

        }, () => {
            if (this.props.onchange) this.props.onChange({ isEnabled: this.state.isEnabled, answerCondition: this.state.aConditions })

        })
    }


    render() {

        return (
            <div>
                <div className="custom-control custom-switch">
                    <input defaultChecked={this.state.isEnabled} onChange={e => this.setState({ isEnabled: e.target.checked })} type="checkbox" className="form-check-input" id="customSwitch1" />
                    <label className="custom-control-label" htmlFor="customSwitch1">Enabled</label>

                </div>
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
                        {this.state.aConditions.map((item: QAAnswerCondition, index: number) => {
                            let options = this.props.options || [];
                            let ifTrueValue = item.ifTrue && item.ifTrue.value ? item.ifTrue.value : undefined;
                            let ifFalseValue = item.ifFalse && item.ifFalse.value ? item.ifFalse.value : undefined;

                            let comparisonValueSelect = (ifFalseOrTrue: string) => <ValueInput
                                key={`literalv-${getRandomId()}`}
                                onChange={(data: any) => this.editIfTrueFalseValue(ifFalseOrTrue, index, data)}
                                options={options.map((item: any) => ({ value: item.value, label: item.value }))}
                                value={ifFalseOrTrue === "true" ?ifTrueValue : ifFalseValue}
                                questionType={this.props.answerType} />

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
