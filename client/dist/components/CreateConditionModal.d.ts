import React from "react";
import { CreateCondition } from "./CreateCondition";
import { ILiteral, QAQuestion, QACondition } from "dpform";
interface CreateConditionModalState {
    isOpen: boolean;
    literals: ILiteral[];
    errors: {
        message: string;
    }[];
}
interface CreateConditionModalProp {
    isOpen: boolean;
    definedQuestions: {
        [key: string]: QAQuestion;
    };
    onSubmit?: (data: ILiteral[]) => void;
    onCancel?: (data: ILiteral[]) => void;
    condition?: QACondition;
}
export declare class CreateConditionModal extends React.Component<CreateConditionModalProp, CreateConditionModalState> {
    createCondition_: React.RefObject<CreateCondition>;
    static defaultProps: {
        isOpen: boolean;
        condition: QACondition;
    };
    constructor(props: CreateConditionModalProp);
    handleChange: (data: ILiteral[]) => void;
    primaryButtonHandler: () => void;
    secondaryButtonHandler: () => void;
    render(): JSX.Element;
}
export {};
