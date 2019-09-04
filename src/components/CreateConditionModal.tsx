import React from "react";
import { Button, Row, ModalFooter, ModalBody } from "reactstrap";
import { QACondition } from "../form/condition";
import { QALiteral } from "../form/answer";
import Modal from "react-modal";
import { CreateCondition } from "./CreateCondition";



interface CreateConditionModalState {
    isOpen: boolean,
    literals: QALiteral[],
    errors: { message: string }[]
}

interface CreateConditionModalProp {
    isOpen: boolean
    onSubmit?: (data: QALiteral[]) => void;
    onCancel?: (data: QALiteral[]) => void;
    condition?: QACondition
}


export class CreateConditionModal extends React.Component<CreateConditionModalProp, CreateConditionModalState> {
    createCondition_: React.RefObject<CreateCondition>;
    static defaultProps = {
        isOpen: false,
        condition: new QACondition()
    };

    constructor(props: CreateConditionModalProp) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen,
            literals: this.props.condition && this.props.condition.literals ? this.props.condition.literals : [],
            errors: []
        };
        this.createCondition_ = React.createRef();
    }
    handleChange = (data: QALiteral[]) => {
        this.setState({
            errors: [],
            literals: data
        });
    };
    primaryButtonHandler = () => {
        let newCondition = new QACondition().setLiterals(this.state.literals);
        let isValid = QACondition.checkIfValid(newCondition);
        if (!isValid) {
            this.setState({
                errors: [{ message: "Condition is not valid!" }]
            });
            return;
        }
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.literals);
        }
    };
    secondaryButtonHandler = () => {
        if (this.props.onCancel) {
            this.props.onCancel(this.state.literals);
        }
    };
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
        return (<Modal style={customStyles} isOpen={this.props.isOpen}>
            <ModalBody>

                {this.props.isOpen && <CreateCondition condition={this.props.condition ? this.props.condition : undefined} ref={this.createCondition_} onChange={(data) => this.handleChange(data)} />}
                <Row>
                    <div className="btn-danger">{this.state.errors.map((item: { message: string }) => item.message)}</div>
                </Row>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" onClick={this.primaryButtonHandler}>Submit</Button>
                <Button color="secondary" onClick={this.secondaryButtonHandler}>Cancel</Button>
            </ModalFooter>
        </Modal>);
    }
}
