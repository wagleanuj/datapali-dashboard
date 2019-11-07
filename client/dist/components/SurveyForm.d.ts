import { ITreeNode } from "@blueprintjs/core";
import { Constants, IDupeSettings, ILiteral, QAQuestion, QORS, QuestionSection, RootSection } from "dpform";
import React from "react";
interface SurveyFormState {
    activeSection: QuestionSection | RootSection;
    activeSectionPath: number[];
    selectedNodes: string[];
    expandedNodes: string[];
    root?: RootSection;
    constants: Constants;
}
interface SurveyFormProps {
    root?: RootSection;
    onChange: (root: RootSection) => void;
    token: string;
    onSave: (root: RootSection) => void;
}
export declare class SurveyForm extends React.Component<SurveyFormProps, SurveyFormState> {
    private toasterRef;
    constructor(props: SurveyFormProps);
    componentDidMount(): void;
    loadForm(): Promise<void>;
    getAllEntries(startSectionPath: number[], startIndex: number, root: RootSection, fetchType: QORS | null, first?: boolean, returnbag?: (QuestionSection | QAQuestion)[]): (QAQuestion | QuestionSection)[];
    handleAddSection(): void;
    handleAddQuestion(): void;
    handleDeleteQuestionOrSection(deleteid: string, path_: number[]): void;
    private handleUpOneLevel;
    private handleSave;
    handleToolbarItemClick(name: string): void;
    handleQuestionUpdate(question: QAQuestion, path: number[]): void;
    handleFormTreeNodeExpand(nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>): void;
    handleFormTreeNodeCollapse(nodeData: ITreeNode): void;
    handleFormTreeNodeClick(nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>): void;
    handleRootNameChange(newName: string): void;
    handleSectionChange(id: string, path: number[]): void;
    handleDuplicatingSettingsChange(id: string, dupe: IDupeSettings): void;
    handleSectionNameChange(id: string, v: string): void;
    handleMoveUp(id: string, path: number[]): void;
    handleSectionConditionChange(sectionId: string, literals: ILiteral[]): void;
    handleSectionCustomIdChange(sectionId: string, v: string): void;
    render(): JSX.Element;
}
export {};
