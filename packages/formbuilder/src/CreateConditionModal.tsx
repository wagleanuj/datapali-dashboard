import { Button, Classes, Dialog } from "@blueprintjs/core";
import { ILiteral, QACondition, QAQuestion } from "@datapali/dpform";
import React from "react";
import { CreateCondition } from "./CreateCondition";



interface CreateConditionModalState {
    isOpen: boolean,
    literals: ILiteral[],
    errors: { message: string }[]
}

interface CreateConditionModalProp {
    isOpen: boolean
    definedQuestions: { [key: string]: QAQuestion }
    onSubmit?: (data: ILiteral[]) => void;
    onCancel?: (data: ILiteral[]) => void;
    themeName?:string;
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
    handleChange = (data: ILiteral[]) => {
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

        return (<Dialog isCloseButtonShown={false} title={"Add/Edit Condition"} style={{ width: 900 }} isOpen={this.props.isOpen}>
            <div style={{ maxHeight: 500, overflow: 'auto', minHeight:500 }} className={Classes.DIALOG_BODY}>

                {this.props.isOpen && <CreateCondition definedQuestions={this.props.definedQuestions} condition={this.props.condition ? this.props.condition : undefined} ref={this.createCondition_} onChange={(data) => this.handleChange(data)} />}
                <div className="btn-danger">{this.state.errors.map((item: { message: string }) => item.message)}</div>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button color="primary" onClick={this.primaryButtonHandler}>Submit</Button>
                    <Button color="secondary" onClick={this.secondaryButtonHandler}>Cancel</Button>
                </div>
            </div>

        </Dialog>);
    }
}
