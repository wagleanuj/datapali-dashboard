import React, { RefObject } from "react";
import { Formik, Field, Form, FormikActions } from 'formik';
import { faPlusSquare, faCross, faWindowClose, faArrowUp, faKey, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import * as _ from "lodash";
import {
    Button,
    Table,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Input,
    Row,
    Col,
    ModalFooter,
    ModalBody,
    ModalHeader
} from "reactstrap";
import { string, any } from "prop-types";
import { QACondition, QAFollowingOperator } from "../form/condition";
import { QALiteral, QAComparisonOperator, QAType, AnswerType, QAContent } from "../form/answer";
import { QAQuestion, QAAutoAnswer } from "../form/question";
import { ValueType } from "react-select/src/types";
import { AddOption } from "./addChoice";
import Modal from "react-modal";
import { openModal, destroyModal } from "../utils/util";
import { AutofillCondition } from "./AutofillCondition";
import { getRandomId } from "../utils/getRandomId";
let root: HTMLElement = document.getElementById("root") || document.body;
Modal.setAppElement(root);


function getOperatorForType(type?: AnswerType) {
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

const customStyles = {
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

interface SelectOption {
    value: string | keyof typeof AnswerType,
    label: string
}

class CreateOptions extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <></>
        )
    }
}
type CreateConditionState = any;

type CreateConditionProps = {
    definedQuestions?: { [key: string]: QAQuestion }
    onChange?: (data: QALiteral[]) => void
    literals?: Array<QALiteral>
    setLiteralsSetter?: Function
    condition?: QACondition

}

export class ValueInput extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

    }
    onDataChange(data: any) {
        if (this.props.onChange) {
            this.props.onChange(data)
        }
    }

    render() {
        let comp = null;
        let opt_ = [];
        switch (this.props.questionType) {
            case AnswerType.Boolean:
                opt_ = [{ value: true, label: "True" }, { value: false, label: "False" }];
                comp = <Select
                    options={opt_}
                    value={opt_.find(i => i.value === this.props.value)}
                    onChange={this.props.onChange.bind(this)}
                    styles={customStyles}
                />
                break;
            case AnswerType.Date:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="date" defaultValue={this.props.value} />
                break;
            case AnswerType.Number:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="number" defaultValue={this.props.value} />
                break;
            case AnswerType.Select:
                comp = <Select styles={customStyles} onChange={this.onDataChange.bind(this)} options={this.props.options} value={this.props.options.find((item: any) => item.value === this.props.value)} />
                break;
            case AnswerType.String:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="text" defaultValue={this.props.value} />
                break;
            case AnswerType.Time:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="time" defaultValue={this.props.value} />
                break;
            default:
                comp = <input onChange={e => this.onDataChange({ value: e.target.value })} className="form-control" type="text" disabled />
                break;
        }
        return comp;
    }
}
enum TableFieldType {
    QuestionRef = 1,
    ComparisonOperator,
    ComparisonValue,
    FollowingOperator,
}

const testQuestion = new QAQuestion().setAnswerType(AnswerType.Select).setQuestionContent({ type: QAType.String, content: "what is your cat's name?" }).setReferenceId("question-1");
for (let i = 0; i < 5; i++) { testQuestion.addOption({ value: `cat${i}` }) }
const testQuestion2 = new QAQuestion().setAnswerType(AnswerType.Select).setQuestionContent({ type: QAType.String, content: "what is your favorite tv?" }).setReferenceId("question-2");
for (let i = 0; i < 5; i++) { testQuestion2.addOption({ value: `tv${i}` }) }

const testQuestion3 = new QAQuestion().setAnswerType(AnswerType.Boolean).setQuestionContent({ type: QAType.String, content: "Do you like having sex?" }).setReferenceId("question-3");
const testQuestion4 = new QAQuestion().setAnswerType(AnswerType.Number).setQuestionContent({ type: QAType.String, content: "How many times have you had HIV AIDS?" }).setReferenceId("question-4");
const testQuestion5 = new QAQuestion().setAnswerType(AnswerType.String).setQuestionContent({ type: QAType.String, content: "Who taught you how to have sex?" }).setReferenceId("question-5");

export class CreateCondition extends React.Component<CreateConditionProps, CreateConditionState>{
    columns: { dataField: string; text: string; }[];
    static defaultProps: CreateConditionProps = {
        onChange: () => { },
        definedQuestions: { 'question-1': testQuestion, 'question-2': testQuestion2, "question-3": testQuestion3, "question-4": testQuestion4, "question-5": testQuestion5 }
    }
    constructor(props: any) {
        super(props);
        this.state = {
            literals: this.props.condition ? this.props.condition.literals : [],
        }
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
        ]

    }
    componentDidMount() {
        if (this.props.setLiteralsSetter) {
            this.props.setLiteralsSetter(this.setLiterals.bind(this));
        }
    }

    setLiterals(newLiterals: QALiteral[]) {
        this.setState({
            literals: newLiterals
        })
    }


    addLiteral(literal?: QALiteral) {
        if (!literal) literal = { literalId: getRandomId("lit-"), questionRef: undefined, comparisonOperator: undefined, comparisonValue: undefined, followingOperator: undefined }
        this.setState((prevState: any) => {
            let newLiterals = _.clone(prevState.literals);
            newLiterals.push(literal);
            return { literals: newLiterals }
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.literals)
            }
        })
    }

    moveLiteralUp(index: number) {
        this.setState((prevState: any) => {
            let newLiterals = _.clone(prevState.literals);
            const get_new_index = (i: number, length: number) => {
                const mod = (x: number, n: number) => (x % n + n) % n;
                return mod(i - 1, length);
            }
            let newIndex = get_new_index(index, newLiterals.length);
            [newLiterals[index], newLiterals[newIndex]] = [newLiterals[newIndex], newLiterals[index]];

            return {
                literals: newLiterals
            }
        }, this.forceUpdate.bind(this))
    }
    handleDataChange(literalIndex: number, valueField: TableFieldType, newValue: any) {
        this.setState((prevState: any) => {
            let newLiterals: QALiteral[] = _.clone(prevState.literals);
            let current = newLiterals[literalIndex];
            switch (valueField) {
                case TableFieldType.QuestionRef:
                    current.questionRef = newValue.value;
                    break;
                case TableFieldType.ComparisonOperator:
                    let prop: keyof typeof QAComparisonOperator
                    let accessProp: keyof typeof QAComparisonOperator
                    for (prop in QAComparisonOperator) {
                        if (QAComparisonOperator[prop] === newValue.value) {
                            accessProp = prop;
                            current.comparisonOperator = QAComparisonOperator[accessProp]
                            break;
                        }
                    }
                    break;
                case TableFieldType.ComparisonValue:
                    let newComparisonValue: QAContent = { content: newValue.value, type: QAType.String }
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
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.literals);
        })
    }

    getQuestion(questionRef?: string) {
        if (questionRef && this.props.definedQuestions && !_.isEmpty(this.props.definedQuestions)) {
            let v = this.props.definedQuestions[questionRef];
            return v;

        }
        return null;
    }
    removeLiteral(index: number) {
        this.setState((prevState: any) => {
            let newLiterals = _.clone(prevState.literals);
            newLiterals.splice(index, 1);
            return {
                literals: newLiterals
            }
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.literals)
            }
        })
    }
    render() {
        return (
            <Card>
                <CardHeader>{`${this.props.condition ? "Edit" : "Add"} Condtion`}</CardHeader>
                <CardBody>
                    <Row>
                        <Table>
                            <thead>
                                <tr>
                                    <th key="th-first">{``}</th>
                                    {this.columns.map((item, key) => {
                                        return <th key={key}>{item.text}</th>
                                    })}
                                    <th key="th-last">{``}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.literals.map((item: QALiteral, key: number) => {

                                    let questions_ = this.props.definedQuestions ? Object.values(this.props.definedQuestions).map((item: QAQuestion) => ({ value: item.referenceId, label: item.questionContent.content })) : [];
                                    let questionselect = <Select
                                        key={`literalq-${key}-${item.literalId}`}
                                        styles={customStyles}
                                        options={questions_}
                                        value={questions_.find((r: any) => r.value === item.questionRef)}
                                        onChange={(selecteOption: ValueType<SelectOption>) => this.handleDataChange(key, TableFieldType.QuestionRef, selecteOption)}

                                    />
                                    let selectedQuestionType = item.questionRef && this.props.definedQuestions ? this.props.definedQuestions[item.questionRef].answerType : undefined;
                                    let comparisionOPOptions_: SelectOption[] = getOperatorForType(selectedQuestionType).map((val, index) => ({ value: val, label: val }))
                                    let comparisonOpSelect = <Select
                                        key={`literalo-${key}-${item.literalId}`}
                                        styles={customStyles}
                                        options={comparisionOPOptions_}
                                        value={comparisionOPOptions_.find((op, index) => op.value === item.comparisonOperator)}
                                        onChange={this.handleDataChange.bind(this, key, TableFieldType.ComparisonOperator)}
                                    />
                                    let question_: QAQuestion | null = this.getQuestion(item.questionRef);
                                    let qAnswerType = question_ ? question_.answerType : null;
                                    let qOptions = question_ && question_.options ? question_.options : [];
                                    let comparisonValueSelect = <ValueInput
                                        key={`literalv-${key}-${item.literalId}`}
                                        onChange={this.handleDataChange.bind(this, key, TableFieldType.ComparisonValue)}
                                        options={qOptions.map(item => ({ value: item.value, label: item.value }))}
                                        value={item.comparisonValue && item.comparisonValue.content} questionType={qAnswerType} />

                                    let followingOperatorOptions_: SelectOption[] = Object.keys(QAFollowingOperator).map((key) => ({ label: key, value: key === "AND" ? QAFollowingOperator.AND : key === "OR" ? QAFollowingOperator.OR : "" }))
                                    let followingOperatorSelect = <Select
                                        key={`literalfo-${key}-${item.literalId}`}
                                        styles={customStyles}
                                        options={followingOperatorOptions_}
                                        value={followingOperatorOptions_.find(r => r.value === item.followingOperator)}
                                        onChange={this.handleDataChange.bind(this, key, TableFieldType.FollowingOperator)}

                                    />
                                    return <tr key={"tr_" + key}>
                                        <td><Button type="button" size="sm" onClick={() => this.moveLiteralUp(key)}><FontAwesomeIcon icon={faArrowUp} /></Button></td>
                                        <td>l<sub>{key}</sub></td>
                                        <td className="questionRef">{questionselect}</td>
                                        <td className="comparisonOperator">{comparisonOpSelect}</td>
                                        <td className="comparisonValue">{comparisonValueSelect}</td>
                                        <td className="followingOperator">{followingOperatorSelect}</td>
                                        <td><Button size="sm" onClick={() => { this.removeLiteral(key) }}> <FontAwesomeIcon icon={faWindowClose} /></Button></td>
                                    </tr>
                                })}
                                <tr>
                                    <td ><Button size="sm" onClick={() => this.addLiteral()} type="button" >
                                        <FontAwesomeIcon icon={faPlusSquare} />
                                    </Button></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>

                                </tr>

                            </tbody>
                        </Table>
                    </Row>

                </CardBody>
            </Card>
        )
    }
}

interface CreateConditionModalProp {
    isOpen: boolean
    onSubmit?: (data: QALiteral[]) => void;
    onCancel?: (data: QALiteral[]) => void;
    condition?: QACondition
    setLiteralsSetter?: Function
}
export class CreateConditionModal extends React.Component<CreateConditionModalProp, any> {
    createCondition_: React.RefObject<CreateCondition>
    static defaultProps = {
        isOpen: false,

    }
    literalsSetter: any;
    constructor(props: CreateConditionModalProp) {
        super(props);
        this.state = {
            literals: this.props.condition && this.props.condition.literals,
            errors: []
        }
        this.createCondition_ = React.createRef();
    }


    handleChange = (data: QALiteral[]) => {
        this.setState({
            errors: [],
            literals: data
        })
    }
    primaryButtonHandler = () => {
        let newCondition = new QACondition().setLiterals(this.state.literals);
        let isValid = QACondition.checkIfValid(newCondition)
        if (!isValid) {
            this.setState({
                errors: [{ message: "Condition is not valid!" }]
            })
            return;
        }

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.literals);
        }



    }
    secondaryButtonHandler = () => {
        if (this.props.onCancel) {
            this.props.onCancel(this.state.literals);
        }
    }
    render() {
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                minHeight: "400px",
                backgroundColor: "#27293d"
            },
            overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.50)"
            }
        };
        return (
            <Modal style={customStyles} isOpen={this.props.isOpen}>
                <ModalBody>

                    {this.props.isOpen && <CreateCondition condition={this.props.condition ? this.props.condition : undefined} ref={this.createCondition_} onChange={(data) => this.handleChange(data)} />}
                    <Row>
                        <div className="btn-danger">{this.state.errors.map((item: any) => item.message)}</div>
                    </Row>
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.primaryButtonHandler}>Submit</Button>
                    <Button color="secondary" onClick={this.secondaryButtonHandler}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

