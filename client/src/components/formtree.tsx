import { QuestionSection } from "./SurveyForm";

import { ITreeNode, Tree, Classes } from "@blueprintjs/core";

import React from "react";

import { QAQuestion } from "../form/question";
import { RootSection } from "./section";



interface FormTreeState {
}
interface FormTreeProps {
    root_: RootSection,
    selectedNodes: string[],
    expandedNodes: string[],
    handleNodeClick?: (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => void,
    handleNodeCollapse?: (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => void,
    handleNodeExpand?: (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => void,

}
export class FormTree extends React.Component<FormTreeProps, FormTreeState>{
    constructor(props: FormTreeProps) {
        super(props);
        this.state = {

        }
    }
    private handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        if (this.props.handleNodeClick) this.props.handleNodeClick(nodeData, _nodePath, e);
    };

    private handleNodeCollapse = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        if (this.props.handleNodeCollapse) this.props.handleNodeCollapse(nodeData, _nodePath, e);
    };

    private handleNodeExpand = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        if (this.props.handleNodeExpand) this.props.handleNodeExpand(nodeData, _nodePath, e);
    };
    getNodeFromQuestionOrSection(item: QuestionSection | QAQuestion, sectionNumber: string, selectedNodes: string[], expandedNodes: string[]) {
        let def: ITreeNode = {
            id: item.id,
            icon: undefined,
            label: "",
            isSelected: selectedNodes.includes(item.id),
            isExpanded: expandedNodes.includes(item.id)
        };
        if (item instanceof QAQuestion) {
            def.icon = "document"
            def.label = `${sectionNumber} ${item.questionContent.content||"Question"}`;
        }
        else if (item instanceof QuestionSection) {
            def.icon = "folder-close"
            def.label = `${sectionNumber} ${item.name || "Section"}`;
            def.childNodes = item.content.map((it, ind) => this.getNodeFromQuestionOrSection(it, sectionNumber + "." + (ind + 1), selectedNodes, expandedNodes))

        }
        return def;
    }

    generateITNodeTree(form: RootSection, selectedNodes: string[], expandedNodes: string[]): ITreeNode[] {
        let root: ITreeNode = {
            id: form.id,
            hasCaret: true,
            icon: "folder-close",
            label: "Root",
            isExpanded: expandedNodes.includes(form.id),
            isSelected: selectedNodes.includes(form.id),
            childNodes: form.content.map((it: QAQuestion | QuestionSection, ind: number) => this.getNodeFromQuestionOrSection(it, (ind + 1).toString(), selectedNodes, expandedNodes))
        }
        return [root];
    }



    render() {
        console.log(this.props.root_);
        return <Tree contents={this.generateITNodeTree(this.props.root_, this.props.selectedNodes, this.props.expandedNodes)}
            onNodeClick={this.handleNodeClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
            className={Classes.ELEVATION_0} />

    }
}
