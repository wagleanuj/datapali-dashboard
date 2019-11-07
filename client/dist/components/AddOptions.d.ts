import { AnswerOptions, Constants, ILiteral, IOption, IOptionGroup, IValueType, QAQuestion } from "dpform";
import React from "react";
interface QAAddOptionsState {
    options: AnswerOptions;
}
interface QAAddOptionsProps {
    constants: Constants;
    definedQuestions: {
        [key: string]: QAQuestion;
    };
    options: AnswerOptions;
    defaultOptionType: IValueType;
    onChange: (options: AnswerOptions) => void;
}
declare enum OPTION_OR_GROUP {
    OPTION = 1,
    GROUP = 2
}
export declare class QAAddOptions extends React.Component<QAAddOptionsProps, QAAddOptionsState> {
    constantNameInputRef: HTMLInputElement | null;
    makeFromTextInputRef: HTMLTextAreaElement | null;
    constructor(props: QAAddOptionsProps);
    makeConstant(): void;
    makeOptionsFromText(): void;
    handleChange(): void;
    handleAddNewOption(): void;
    handleGroupNameChange(oldname: string, newname: string): void;
    handleGroupDelete(name: string): void;
    handleOptionTypeChange(id: string, newType: IValueType): void;
    handleGroupAssignment(ids: string[], groupname: string): void;
    handleGroupUnassignment(ids: string[]): void;
    handleOptionDelete(id: string): void;
    handleOptionValueChange(id: string, newValue: string): void;
    handleAddGroup(): void;
    handleConditionClick(type: OPTION_OR_GROUP, name: string): void;
    setCondition(idOrname: string, type: OPTION_OR_GROUP, literals: ILiteral[]): void;
    handleImportFromConstant(a: any): void;
    render(): JSX.Element;
}
interface QAAoptionSectionProps {
    defaultType: IValueType;
    options: IOption[];
    groups: IOptionGroup[];
    handleAddNewOption?: () => void;
    handleOptionTypeChange?: (id: string, newType: IValueType) => void;
    handleGroupAssignment?: (ids: string[], groupname: string) => void;
    handleOptionDelete?: (id: string) => void;
    handleConditionClick?: (id: string) => void;
    handleOptionValueChange?: (id: string, newVal: string) => void;
}
interface QAAddOptionsSectionState {
    options: IOption[];
}
export declare class QAOptionSection extends React.Component<QAAoptionSectionProps, QAAddOptionsSectionState> {
    static defaultProps: {
        options: any[];
        groups: any[];
    };
    constructor(props: QAAoptionSectionProps);
    shouldComponentUpdate(nextProps: QAAoptionSectionProps, nextState: QAAddOptionsSectionState): boolean;
    generateAddGroupInput(option: IOption): JSX.Element;
    handleAddNewOption(): void;
    handleConditionEdit(id: string): void;
    handleAddGroupInput(index: number): void;
    handleOptionDelete(id: string): void;
    handleOptionTypeChange(option_id: string, newType: IValueType): void;
    handleOptionValueChange(id: string, newValue: any): void;
    render(): JSX.Element;
}
interface QAAoptionGroupSectionProps {
    groups: IOptionGroup[];
    options: IOption[];
    handleGroupAssignment?: (id: string[], groupname: string) => void;
    handleGroupUnassignment?: (id: string[]) => void;
    handleGroupNameChange?: (oldname: string, newname: string) => void;
    handleGroupDelete?: (name: string) => void;
    handleGroupConditionClick?: (name: string) => void;
    handleAddGroup?: () => void;
}
interface QAAddOptionSectionState {
}
export declare class QAAddGroupSection extends React.Component<QAAoptionGroupSectionProps, QAAddOptionSectionState> {
    constructor(props: QAAoptionGroupSectionProps);
    handleGroupAssignment(e: {
        value: string;
        label: string;
    }[], groupname: string): void;
    render(): JSX.Element;
}
export {};
