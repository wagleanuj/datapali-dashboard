import React, { RefObject } from "react";
import { Formik, Field, Form, FormikActions } from 'formik';
import { faCross, faKey, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import * as _ from "lodash";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Input,
    Row,
    Col,
    ModalHeader,
    Container
} from "reactstrap";
import { QACondition } from "../form/condition";
import { QALiteral, QAComparisonOperator, QAType, AnswerType } from "../form/answer";
import { QAQuestion, QAAutoAnswer } from "../form/question";
import { QAAddOptions as AddOption } from "./AddOptions";
import { AnswerOptions } from "./AnswerOptions";
import Modal from "react-modal";
import { openModal, destroyModal } from "../utils/util";
import { AutofillCondition } from "./AutofillCondition";
import { CreateConditionModal } from "./CreateConditionModal";
import { ANSWER_TYPES, AnswerTypeInput, QAValueType } from "./AnswerType";
import { ValInput } from "./ValInput";
import { ValueType } from "react-select/src/types";
let root: HTMLElement = document.getElementById("root") || document.body;
Modal.setAppElement(root);

export function getOperatorForType(valueType?: QAValueType) {
    let allOperators = Object.values(QAComparisonOperator);
    let type = valueType && valueType.name;

    switch (type) {
        case ANSWER_TYPES.BOOLEAN:
        case ANSWER_TYPES.DATE:
        case ANSWER_TYPES.STRING:
        case ANSWER_TYPES.TIME:


            return allOperators.filter(item => item === QAComparisonOperator.Equal);
        case ANSWER_TYPES.NUMBER:
            deftault:
            return allOperators;
    }
    return [QAComparisonOperator.Equal]
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
        zIndex: 9999


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

interface Values {
    question: string;
    type: string;
    email: string;
}
interface FormItemProps {
    question: QAQuestion
}
interface FormItemState{
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
    openAppearingConditionModal() {
        let el = <CreateConditionModal
            isOpen={true}
            onSubmit={this.editAppearingCondition.bind(this)}
            onCancel={destroyModal.bind(this)}
            condition={this.state.question.appearingCondition} />
        openModal(el);
    }

    editAppearingCondition(newLiterals: QALiteral[]) {
        this.setState((prevState: any) => {
            let question: QAQuestion = _.clone(prevState.question)
            if (!question.appearingCondition) question.setAppearingCondition(new QACondition())
            question.appearingCondition.setLiterals(newLiterals)
            return {
                question: question
            }
        }, () => {
            destroyModal();
        })
    }
    handleQuestionChange(e: string){
        this.setState((prevState: FormItemState)=>{
            let question = _.clone(prevState.question);
            question.setQuestionContent({type: QAType.String, content: e});
            return {
                question: question
            }
        })
    }
    handleAnswerTypeChange(type: QAValueType){
        this.setState((prevState: FormItemState)=>{
            let question = _.clone(prevState.question);
            question.setAnswerType(type);
            return {
                question: question
            }
        })
    }
    handleOptionsChange(options: AnswerOptions){
        this.setState((prevState: FormItemState)=>{
            let question = _.clone(prevState.question);
            question.setOptions(options);
            return {
                question: question
            }
        })
    }

    render() {
        let AnswerKeys = Object.keys(AnswerType);
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
                                            <textarea className="form-control" onChange = {e=>this.handleQuestionChange(e.target.value)}  id="question" name="question" placeholder=""  />
                                        </FormGroup>


                                        <FormGroup>
                                            <label htmlFor="isRequired">Required</label>
                                            <Select styles={customStyles} id="isRequired" options={[{ value: true, label: "Yes" }, { value: false, label: "No" }]} />
                                        </FormGroup>
                                        <FormGroup>
                                            <AnswerTypeInput answerType={this.state.question.answerType} onChange={this.handleAnswerTypeChange.bind(this)} />
                                        </FormGroup>
                            
                                       {this.state.question.answerType && this.state.question.answerType.name===ANSWER_TYPES.SELECT && this.state.question.answerType.ofType && <FormGroup >
                                            <label >Add Options</label>
                                            <Card>
                                            <AddOption onChange={this.handleOptionsChange.bind(this)} defaultOptionType={this.state.question.answerType} options={new AnswerOptions()} />
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

                                                <AutofillCondition onChange={(data: QAAutoAnswer) => {
                                                    this.setState((prevState: any) => {
                                                        let cloned: QAQuestion = _.clone(prevState.question);
                                                        cloned.setAutoAnswer(data)
                                                        return {
                                                            question: cloned
                                                        }
                                                    })
                                                }}
                                                    answerType={this.state.question.answerType}
                                                    options={this.state.question.options} />

                                            </FormGroup>
                                        </FormGroup>


                                    </CardBody>
                                    <CardFooter>
                                        <Button className="btn-fill" color="primary" type="submit">
                                            Submit
                                            </Button>
                                    </CardFooter>
                                </Card>
                        </div>
                    </Form>)




            
    }
}

export interface SelectOption {
    value: string | keyof typeof AnswerType,
    label: string
}



export enum TableFieldType {
    QuestionRef = 1,
    ComparisonOperator,
    ComparisonValue,
    FollowingOperator,
}

