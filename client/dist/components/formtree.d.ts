import { ITreeNode } from "@blueprintjs/core";
import React from "react";
import { RootSection, QuestionSection, QAQuestion } from "dpform";
interface FormTreeState {
}
interface FormTreeProps {
    root_: RootSection;
    selectedNodes: string[];
    expandedNodes: string[];
    handleNodeClick?: (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => void;
    handleNodeCollapse?: (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => void;
    handleNodeExpand?: (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => void;
}
export declare class FormTree extends React.Component<FormTreeProps, FormTreeState> {
    constructor(props: FormTreeProps);
    private handleNodeClick;
    private handleNodeCollapse;
    private handleNodeExpand;
    getNodeFromQuestionOrSection(item: QuestionSection | QAQuestion, sectionNumber: string, selectedNodes: string[], expandedNodes: string[]): ITreeNode<{}>;
    generateITNodeTree(form: RootSection, selectedNodes: string[], expandedNodes: string[]): ITreeNode[];
    render(): JSX.Element;
}
export {};
