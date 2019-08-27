import React from "react";
import { ListGroup, ListGroupItem, Button, Row, Badge, Col, Container } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faKey } from "@fortawesome/free-solid-svg-icons";

import _ from "lodash";
import { CreateCondition, CreateConditionModal } from "./DPFormItem";
import { getRandomId } from "../utils/getRandomId";
import { QACondition } from "../form/condition";
import Modal from "react-modal";
import { QALiteral } from "../form/answer";
import { openModal, destroyModal } from "../utils/util";

interface QAOption {
    condition?: QACondition
    id: string
    value: string
    type?: string
}
interface AddOptionProp {
    options: QAOption[],
    onChange: Function
    onError: Function
    shouldAllowDuplicateOptions: Boolean
}

interface AddOptionState {
    options: QAOption[],
    selectedOptionToEdit: number,
    isModalOpen: boolean
}

export class AddOption extends React.Component<AddOptionProp, AddOptionState>{
    inputRef_: React.RefObject<HTMLInputElement>;
    static defaultProps = {
        options: [],
        onChange: () => { },
        onError: () => { },
        shouldAllowDuplicateOptions: false
    }
    constructor(props: AddOptionProp) {
        super(props);
        this.state = {
            options: this.props.options,
            selectedOptionToEdit: -1,
            isModalOpen: false
        }
        this.inputRef_ = React.createRef();
    }

    optionRemovalHandler(option_index: number) {
        this.setState((prevState: AddOptionState) => {
            let options = _.clone(prevState.options)
            options.splice(option_index, 1);
            return {
                options: options,
            }
        })
    }

    editConditionOnOption(index: number, newLiterals: QALiteral[]) {
        this.setState((prevState: AddOptionState) => {
            let clonedOptions = _.clone(prevState.options);
            let selectedOpt = clonedOptions[index];
            if (!selectedOpt) return prevState;
            if (selectedOpt.condition) {
                selectedOpt.condition.setLiterals(newLiterals)
            }
            else {
                selectedOpt.condition = new QACondition().setLiterals(newLiterals);
            }

            if (QACondition.checkIfValid(selectedOpt.condition)) {
                return {
                    options: clonedOptions,
                }
            }
            else {
                return {
                    options: prevState.options,

                }
            }

        }, () => {
            destroyModal();
        });
    }

    handleModalSubmit_(updateIndex: number, newLiterals: QALiteral[]) {
        this.editConditionOnOption(updateIndex, newLiterals);
    }

    handleModalClose() {
        destroyModal();
    }


    conditionButtonClickHandler(e: React.MouseEvent, index: number) {
        this.setState({
            isModalOpen: true,
        })
    }

    keydownHandler(e: any) {
        console.log(this.state.options);
        if (e.key === "Enter") {
            e.preventDefault();
            if (this.inputRef_.current && this.inputRef_.current.value === "") {
                return;
            }

            if (!this.props.shouldAllowDuplicateOptions && this.state.options.find((item: any) => this.inputRef_.current && item.value === this.inputRef_.current.value)) {
                if (this.props.onError) this.props.onError({ message: "Option already exists" });
                return;
            }
            this.setState((prev: AddOptionState) => {
                let newChoices = prev.options.slice(0);
                newChoices.push({ id: getRandomId("opt-"), value: this.inputRef_.current && this.inputRef_.current.value ? this.inputRef_.current.value : '' });
                return {
                    options: newChoices
                };
            }, () => {
                if (this.props.onChange) this.props.onChange(this.state.options);
                if (this.inputRef_.current) this.inputRef_.current.value = "";
            });
        }

    }
    openModals(index: number) {
        let selectedCondition = this.state.options[index];
        let el = <CreateConditionModal condition={selectedCondition && selectedCondition.condition}
            isOpen={true}
            onCancel={this.handleModalClose.bind(this)}
            onSubmit={this.handleModalSubmit_.bind(this, index)}
        />
        openModal(el);
    }

    changeOptionValue(option_index: number, newValue: string) {
        let cloned = _.clone(this.state.options);
        cloned[option_index].value = newValue;
        this.setState({
            options: cloned
        })
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
                backgroundColor: "black"
            },
            overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.50)"
            }
        };
        let selectedCondition = this.state.options[this.state.selectedOptionToEdit];
        return (
            <>

                <div className="">
                    <input placeholder={"Add Option"} ref={this.inputRef_} className="form-control" type="text" onKeyPress={this.keydownHandler.bind(this)} />
                    <Container style={{ backgroundColor: "#1e1e2f", paddingTop: "4px", minHeight: "180px" }}>

                        {this.state.options.map((item: QAOption, index: number) => {
                            return <Row style={{ paddingBottom: "4px", borderBottom: "1px solid #525f7f" }} key={index}>
                                <Col className="d-flex align-items-center text-light" xs={8}> <input className="form-control" type="text" onChange={(e) => this.changeOptionValue(index, e.target.value)} value={item.value} /></Col>
                                <Col xs={2}>
                                    {<Button type="button" onClick={e => this.openModals(index)} size="sm"><FontAwesomeIcon color={item.condition ? "yellow" : "red"} size={"sm"} icon={faKey} /></Button>}
                                </Col>
                                <Col className={"d-flex justify-content-end"} xs={2}>
                                    <Button type="button" onClick={e => this.optionRemovalHandler(index)} size={"sm"} ><FontAwesomeIcon icon={faTimes} /></Button>
                                </Col>
                            </Row>
                        })}
                    </Container>

                </div >
            </>
        )
    }
}