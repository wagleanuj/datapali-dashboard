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
    ModalHeader
} from "reactstrap";
import { QACondition } from "../form/condition";
import { QALiteral, QAComparisonOperator, QAType, AnswerType } from "../form/answer";
import { QAQuestion, QAAutoAnswer } from "../form/question";
import { AddOption } from "./addChoice";
import Modal from "react-modal";
import { openModal, destroyModal } from "../utils/util";
import { AutofillCondition } from "./AutofillCondition";
import { CreateConditionModal } from "./CreateConditionModal";
import { ANSWER_TYPES, AnswerTypeInput } from "./AnswerType";
let root: HTMLElement = document.getElementById("root") || document.body;
Modal.setAppElement(root);

export function getOperatorForType(type?: AnswerType) {
    let allOperators = Object.values(QAComparisonOperator);
    switch (type) {
        case AnswerType.Boolean:
        case AnswerType.Date:
        case AnswerType.String:
        case AnswerType.Time:


            return allOperators.filter(item => item === QAComparisonOperator.Equal);
        case AnswerType.Number:
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
        borderColor: "#e14eca"

    }),
    menuList: (base: any, state: any) => {
        console.log(state)
        return {
            ...base,
            background: "#525f7f",
            color: "white"
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

export class DPFormItem extends React.Component<any, any>{
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

    render() {
        let AnswerKeys = Object.keys(AnswerType);
        return (
            <Formik
                initialValues={{
                    question: '',
                    type: '',
                    email: '',
                }}

                onSubmit={(values: Values, { setSubmitting }: FormikActions<Values>) => {

                }}
                render={() => (

                    <Form>
                        <Row>
                            <Col className="pr-md-1" >
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Add Question</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <FormGroup>
                                            <label htmlFor="question">Question</label>
                                            <Field className="form-control" id="question" name="question" placeholder="" type="text" />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="isRequired">Required</label>
                                            <Select styles={customStyles} id="isRequired" options={[{ value: true, label: "Yes" }, { value: false, label: "No" }]} />
                                        </FormGroup>
                                        <FormGroup>
                                            <AnswerTypeInput onChange={(d)=>{console.log(d)}}/>


                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="type">Appearing Condition</label>
                                            <div>
                                                <Button type="button" onClick={this.openAppearingConditionModal.bind(this)}
                                                    size="sm">
                                                    <FontAwesomeIcon size={"sm"} icon={faKey} /></Button>

                                            </div>

                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="type">Type</label>
                                            <Select onChange={(e: any) => this.setState((prevState: any) => {
                                                let cloned = _.clone(prevState.question)
                                                cloned.setAnswerType(AnswerType[e.value]);

                                                return {
                                                    question: cloned
                                                }
                                            })} styles={customStyles} id="type" options={Object.keys(AnswerType).map((i): SelectOption => ({ value: i, label: i }))} />
                                        </FormGroup>

                                        <FormGroup>
                                            <label htmlFor="type">Add Options</label>

                                            <AddOption onChange={(d: any) => this.setState((prevState: any) => {
                                                let cloned = _.clone(this.state.question);
                                                cloned.options = d;
                                                return {
                                                    question: cloned
                                                }
                                            })} />

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
                            </Col>
                        </Row>
                    </Form>


                )}


            />
        )
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

