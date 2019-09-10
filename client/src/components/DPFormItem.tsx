import React from "react";
import { Form } from 'formik';
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as _ from "lodash";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
} from "reactstrap";
import Modal from "react-modal";
import {openModal, destroyModal} from "../utils"
import { AutofillCondition } from "./AutofillCondition";
import { CreateConditionModal } from "./CreateConditionModal";
import { Switch } from "@blueprintjs/core";
import {
    IValueType,
    QAComparisonOperator,
    ANSWER_TYPES,
    Constants,
    QAQuestion,
    ILiteral,
    QACondition,
    QAType,
    AnswerOptions,
    IAutoAnswer,
    AnswerType
} from "dpform";
import { AnswerTypeInput } from "./AnswerType";
import { QAAddOptions } from "./AddOptions";
let root: HTMLElement = document.getElementById("root") || document.body;
Modal.setAppElement(root);

export function getOperatorForType(valueType?: IValueType) {
    let allOperators = Object.values(QAComparisonOperator);
    let type = valueType && valueType.name;

    switch (type) {
        case ANSWER_TYPES.BOOLEAN:
        case ANSWER_TYPES.DATE:
        case ANSWER_TYPES.STRING:
        case ANSWER_TYPES.TIME:


            return allOperators.filter(item => item === QAComparisonOperator.Equal);
        case ANSWER_TYPES.NUMBER:
        default:
            return allOperators;
    }
}

export const customStyles = {
    container: (base: any, state: any) => ({
        ...base,
        border: state.isFocused ? null : null,
        background: "transparent",
        transition:
            "border-color 0.2s ease, box-shadow 0.2s ease, padding 0.2s ease",
        "&:hover": {
            boxShadow: "0 2px 4px 0 rgba(41, 56, 78, 0.1)",
        }
    }),

    control: (base: any, state: any) => ({
        ...base,
        background: "transparent",
        borderColor: state.isFocused ? brandColor : base.borderColor,
        '&:hover': {
            borderColor: state.isFocused
                ? brandColor
                : base.borderColor
        }
    }),
    valueContainer: (base: any, state: any) => ({
        ...base,
        background: "transparent",
        color: "white"
    }),

    menu: (base: any, state: any) => ({
        ...base,
        background: "black",
        borderColor: "#e14eca",
        zIndex: "999999999999999999 !important"

    }),
    menuList: (base: any, state: any) => {
        console.log(state)
        return {
            ...base,
            background: "#525f7f",
            color: "white",

        }
    },
    singleValue: (base: any, state: any) => ({
        ...base,
        color: "white"
    }),

    input: (base: any, state: any) => ({
        ...base,
        color: "white"
    }),
    option: (base: any, state: any) => ({
        ...base,
        background: state.isSelected ? "lightblue" : state.isFocused ? "hotpink" : "#525f7f"
    }),
};

const brandColor = '#46beed';


interface FormItemProps {
    constants: Constants,
    definedQuestions: { [key: string]: QAQuestion }
    question: QAQuestion,
    onChange: (question: QAQuestion) => void
}
interface FormItemState {
    question: QAQuestion
}

export class DPFormItem extends React.Component<FormItemProps, FormItemState>{
    static defaultProps = {
        question: new QAQuestion()
    }
    constructor(props: any) {
        super(props);
        this.state = {
            question: this.props.question
        }
    }
    shouldComponentUpdate(nextProps: FormItemProps, nextState: FormItemState) {
        if (_.isEqual(nextProps.question, this.state.question)) {
            return false;
        }
        return true;
    }
    handleChange() {
        if (this.props.onChange) this.props.onChange(this.state.question)
    }
    handleRequiredChange(e: any) {
        this.setState((prevState: FormItemState) => {
            let question = _.clone(prevState.question);
            question.setIsRequired(!question.isRequired);
            return {
                question: question
            }
        }, this.handleChange.bind(this))
    }
    openAppearingConditionModal() {
        let el = <CreateConditionModal
            definedQuestions={this.props.definedQuestions}
            isOpen={true}
            onSubmit={this.editAppearingCondition.bind(this)}
            onCancel={destroyModal.bind(this)}
            condition={this.state.question.appearingCondition} />
        openModal(el);
    }

    editAppearingCondition(newLiterals: ILiteral[]) {
        this.setState((prevState: any) => {
            let question: QAQuestion = _.clone(prevState.question)
            if (!question.appearingCondition) question.setAppearingCondition(new QACondition())
            question.appearingCondition.setLiterals(newLiterals);
            console.log(QACondition.toJSON(question.appearingCondition));
            return {
                question: question
            }
        }, () => {
            destroyModal();
            this.handleChange();
        })
    }
    handleQuestionChange(e: string) {
        this.setState((prevState: FormItemState) => {
            let question = _.clone(prevState.question);
            question.setQuestionContent({ type: QAType.String, content: e });
            return {
                question: question
            }
        }, this.handleChange.bind(this))
    }
    handleAnswerTypeChange(type: IValueType) {
        this.setState((prevState: FormItemState) => {
            let question = _.clone(prevState.question);
            question.setAnswerType(type);
            return {
                question: question
            }
        }, this.handleChange.bind(this))
    }
    handleOptionsChange(options: AnswerOptions) {
        this.setState((prevState: FormItemState) => {
            let question = _.clone(prevState.question);
            question.setOptions(options);
            return {
                question: question
            }
        }, this.handleChange.bind(this))
    }
    handleAutoFillChange(autoanswer: IAutoAnswer) {
        this.setState((prevState: any) => {
            let cloned: QAQuestion = _.clone(prevState.question);
            cloned.setAutoAnswer(autoanswer)
            return {
                question: cloned
            }
        }, this.handleChange.bind(this))
    }

    render() {
        return (

            <Form>
                <div>
                    <Card>
                        <CardHeader>
                            <h5 className="title">Add Question</h5>
                        </CardHeader>
                        <CardBody>
                            <FormGroup>
                                <label htmlFor="question">Question</label>
                                <textarea defaultValue={this.state.question.questionContent.content} className="form-control" onChange={e => this.handleQuestionChange(e.target.value)} id="question" name="question" placeholder="" />
                            </FormGroup>


                            <FormGroup>
                                <Switch defaultChecked={this.state.question.isRequired} label="Required" onChange={this.handleRequiredChange.bind(this)} />
                            </FormGroup>
                            <FormGroup>
                                <AnswerTypeInput answerType={this.state.question.answerType} onChange={this.handleAnswerTypeChange.bind(this)} />
                            </FormGroup>

                            {this.state.question.answerType && this.state.question.answerType.name === ANSWER_TYPES.SELECT && this.state.question.answerType.ofType && <FormGroup >
                                <label >Add Options</label>
                                <Card>
                                    <QAAddOptions
                                        constants={this.props.constants}
                                        definedQuestions={this.props.definedQuestions}
                                        onChange={this.handleOptionsChange.bind(this)}
                                        defaultOptionType={this.state.question.answerType}
                                        options={this.state.question.options} />
                                </Card>
                            </FormGroup>}

                            <FormGroup>
                                <label htmlFor="type">Appearing Condition</label>
                                <div>
                                    <Button type="button" onClick={this.openAppearingConditionModal.bind(this)}
                                        size="sm">
                                        <FontAwesomeIcon size={"sm"} icon={faKey} /></Button>

                                </div>

                            </FormGroup>

                            <FormGroup>
                                <FormGroup>
                                    <label htmlFor="type">Add Autofill Conditions</label>

                                    <AutofillCondition
                                        autoAnswer={this.state.question.autoAnswer}
                                        definedQuestions={this.props.definedQuestions}
                                        onChange={this.handleAutoFillChange.bind(this)}
                                        answerType={this.state.question.answerType}
                                        options={this.state.question.options} />

                                </FormGroup>
                            </FormGroup>


                        </CardBody>

                    </Card>
                </div>
            </Form>)





    }
}

export interface ISelectOption {
    value: string | keyof typeof AnswerType,
    label: string
}



