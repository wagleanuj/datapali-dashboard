import React from "react";
import { Table, Button } from "reactstrap";
import { QACondition } from "../form/condition";
import { AnswerType, QALiteral } from "../form/answer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openModal, destroyModal } from "../utils/util";
import { CreateConditionModal } from "./CreateConditionModal";
import { ValueInput } from "./ValueInput";
import { getRandomId } from "../utils/getRandomId";
import _ from "lodash";
import { faKey, faPlusSquare, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { QAAnswerCondition, AnswerOption } from "../form/question";
import { SelectOption } from "./DPFormItem";
import { QAValueType } from "./AnswerType";
import { ValInput } from "./ValInput";
import { QAOption, AnswerOptions } from "./AnswerOptions";

interface AutoAnswerProps {
    onChange: Function,
    options: AnswerOptions,
    answerType: QAValueType
}
interface AutoAnswerState {
    aConditions: QAAnswerCondition[];
    isEnabled: boolean,

}

export class AutofillCondition extends React.Component<AutoAnswerProps, AutoAnswerState> {
    constructor(props: AutoAnswerProps) {
        super(props);
        this.state = {
            aConditions: [],
            isEnabled: true
        }
    }

    editIfTrueFalseValue(type: string, index: number, value: string) {
        this.setState((prevState: AutoAnswerState) => {
            let found = this.props.options.optionGroupMap[value];
            let newConditions = _.clone(prevState.aConditions);
            let selected = newConditions[index];
            if (type === "true") {
                selected.ifTrue = found

            }
            else if (type === "false") {
                selected.ifFalse = found
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
        this.setState((prevState: AutoAnswerState) => {
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
            cloned[index].condition = new QACondition();
        }
        cloned[index].condition.setLiterals(data);
        this.setState({
            aConditions: cloned
        }, () => {
            destroyModal();
            if (this.props.onChange) this.props.onChange({ isEnabled: this.state.isEnabled, answerCondition: this.state.aConditions })

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
            if (this.props.onChange) this.props.onChange({ isEnabled: this.state.isEnabled, answerCondition: this.state.aConditions })

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
                   
                            let comparisonValueSelect = (ifFalseOrTrue: string) => <ValInput
                                key={`literalv-${getRandomId()}`}
                                onChange={(data: {value:string}) => this.editIfTrueFalseValue(ifFalseOrTrue, index, data.value)}
                                options={this.props.options}
                                defaultValue={ifFalseOrTrue === "true" ? item.ifTrue : item.ifFalse}
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
