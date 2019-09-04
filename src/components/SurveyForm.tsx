import React from "react";
import { QAQuestion } from "../form/question";
import { ITreeNode } from "@blueprintjs/core";
import { getRandomId } from "../utils/getRandomId";
import { Row } from "reactstrap";
import { Toolbar } from "./Toolbar";

import { testQuestion, testQuestion2, testQuestion3, testQuestion4, testQuestion5 } from "../testData/TestQuestions";
import _ from "lodash";
import { SectionC } from "./section";
import { FormTree } from "./formtree";

export class QASurveyForm {
    content!: (QuestionSection | QAQuestion)[];
    id: string;
    name!: string;
    constructor() {
        this.id = getRandomId("sf-");
    }
    setName(name: string) {
        this.name = name;
        return this;
    }

    setContent(content: (QuestionSection | QAQuestion)[]) {
        this.content = content;
        return this;
    }

    addContent(content: QAQuestion | QuestionSection) {
        this.content.push(content);
        return this;
    }

}

export class QuestionSection {
    name!: string;
    content!: (QuestionSection | QAQuestion)[]
    id: string
    constructor() {
        this.id = getRandomId("ss-");
        this.content = []

    }
    setID(id: string) {
        this.id = id;
        return this;
    }
    setName(name: string) {
        this.name = name;
        return this;
    }
    setContent(content: (QuestionSection | QAQuestion)[]) {
        this.content = content;
        return this;
    }

    addContent(content: QuestionSection | QAQuestion) {
        this.content.push(content);
        return this;
    }

    deleteContent(contentId: string) {
        let found = this.content.findIndex(item => item.id === contentId);
        if (found > -1) {
            this.content.splice(found, 1);
        }
    }
}

interface SurveyFormState {
    form: QuestionSection,
    activeSection: QuestionSection,
    activeSectionPath: number[]
    selectedNodes: string[],
    expandedNodes: string[],

}
interface SurveyFormProps {
    form: QuestionSection,
    onChange: (form: QuestionSection) => void
}



export class SurveyForm extends React.Component<SurveyFormProps, SurveyFormState>{
    static defaultProps = {
        form: new QuestionSection().setContent([testQuestion, testQuestion2, testQuestion3, new QuestionSection().setContent([testQuestion4, testQuestion5]).setName("true things")]),
    }
    public static questionOrSectionFromPath(path: number[], root: (QuestionSection | QAQuestion)[]): QuestionSection | QAQuestion {
        let el = root[path[0]];
        if (path.length === 1) {
            return el;
        } else {
            return SurveyForm.questionOrSectionFromPath(path.slice(1), el.content);
        }
    }
    constructor(props: SurveyFormProps) {
        super(props);
        this.state = {
            selectedNodes: [],
            expandedNodes: [this.props.form.id],
            form: this.props.form,
            activeSection: this.props.form,
            activeSectionPath: [0]
        }
    }

    handleChange(section: QuestionSection) {
        this.setState((prevState: SurveyFormState) => {
            return {
                form: section,
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.form);
        })
    }

    handleAddSection() {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.form);
            let toAddIn = SurveyForm.questionOrSectionFromPath(this.state.activeSectionPath, [cloned]);
            if (toAddIn instanceof QuestionSection) {
                toAddIn.addContent(new QuestionSection());
            }
            return {
                form: cloned
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.form);
        })
    }

    handleAddQuestion() {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.form);
            let toAddIn = SurveyForm.questionOrSectionFromPath(this.state.activeSectionPath, [cloned]);
            if (toAddIn instanceof QuestionSection) {
                toAddIn.addContent(new QAQuestion());
            }
            return {
                form: cloned,
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.form);
        })
    }
    handleDeleteQuestionOrSection(deleteid: string, path_: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let parent = path_.slice(0, path_.length - 1);
            let cloned = _.clone(prevState.form)
            let parentSection = SurveyForm.questionOrSectionFromPath(parent, [cloned]);
            if (parentSection instanceof QuestionSection) {
                parentSection.deleteContent(deleteid);
            }

            return {
                form: cloned,
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.form);
        })
    }

    handleToolbarItemClick(name: string) {
        switch (name) {
            case "add-section":
                this.handleAddSection()
                break;
            case "add-question":
                this.handleAddQuestion();
                break;
        }
    }

    handleQuestionUpdate(question: QAQuestion, path: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.form);
            let parent = path.slice(0, path.length - 1);
            let parentSection = SurveyForm.questionOrSectionFromPath(parent, [cloned]);
            if (parentSection instanceof QuestionSection) {
                let foundQ = parentSection.content.find(item => item.id === question.id);
                if (foundQ && foundQ instanceof QAQuestion) {
                    foundQ.updateFromQuestion(question);
                }
            }

            return {
                form: cloned
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.form);
        })
    }

    private forEachNode(nodes: ITreeNode[], callback: (node: ITreeNode) => void) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            if (node.childNodes)
                this.forEachNode(node.childNodes, callback);
        }
    }

    handleFormTreeNodeExpand(nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) {
        nodeData.isExpanded = true;
        this.setState((prevState: SurveyFormState) => {
            let item = SurveyForm.questionOrSectionFromPath(_nodePath, [this.state.form]);
            let expandedNodes = _.union([item.id], prevState.expandedNodes);
            return {
                expandedNodes: expandedNodes
            }
        })

    }

    handleFormTreeNodeCollapse(nodeData: ITreeNode) {
        this.setState((prevState: SurveyFormState) => {
            let expandedNodes = prevState.expandedNodes.filter((item => nodeData.id !== item));
            return {
                expandedNodes: expandedNodes
            }
        })
    }


    handleFormTreeNodeClick(nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) {
        let item = SurveyForm.questionOrSectionFromPath(_nodePath, [this.state.form]);
        if (item instanceof QuestionSection) {
            this.setState((prevState: SurveyFormState) => {
                let expandedNodes = _.union([item.id], prevState.expandedNodes);
                let selectedNodes = [item.id];
                return {
                    selectedNodes: selectedNodes,
                    expandedNodes: expandedNodes,
                    activeSection: item instanceof QuestionSection ? item : prevState.activeSection,
                    activeSectionPath: _nodePath
                }

            })
        }
        else {
            this.setState((prevState: SurveyFormState) => {
                let parent = _nodePath.slice(0, _nodePath.length - 1);
                let parentSection = SurveyForm.questionOrSectionFromPath(parent, [prevState.form]);
                let selectedQuestion = SurveyForm.questionOrSectionFromPath(_nodePath, [prevState.form]);
                let expandedNodes = prevState.expandedNodes;
                let selectedNodes = [selectedQuestion.id];
                if (parentSection instanceof QuestionSection) {
                    expandedNodes = _.union([parentSection.id], expandedNodes);
                    selectedNodes.push(parentSection.id);
                }

                return {
                    expandedNodes: expandedNodes,
                    selectedNodes: selectedNodes,
                    activeSection: parentSection instanceof QuestionSection ? parentSection : prevState.activeSection,
                    activeSectionPath: parent
                }


            })
        }
    }

    handleSectionChange(id: string, path: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let section = SurveyForm.questionOrSectionFromPath(path, [prevState.form]);
            let expandedNodes = prevState.expandedNodes;
            let selectedNodes = []
            if (section instanceof QuestionSection) {
                expandedNodes = _.union([section.id], expandedNodes);
                selectedNodes.push(section.id);
            }
            return {
                expandedNodes: expandedNodes,
                selectedNodes: selectedNodes,
                activeSection: section instanceof QuestionSection ? section : prevState.activeSection,
                activeSectionPath: path
            }
        })
    }

    render() {

        return (
            <Row>
                <Toolbar handleItemClick={this.handleToolbarItemClick.bind(this)}></Toolbar>
                <div className="container">

                    <div style={{ background: "transparent" }} className="sidebar">
                        <div className="sidebar-wrapper">
                            <FormTree
                                expandedNodes={this.state.expandedNodes}
                                selectedNodes={this.state.selectedNodes}
                                handleNodeExpand={this.handleFormTreeNodeExpand.bind(this)}
                                handleNodeCollapse={this.handleFormTreeNodeCollapse.bind(this)}
                                handleNodeClick={this.handleFormTreeNodeClick.bind(this)} root={this.state.form} />
                        </div>
                    </div>
                    <div className="content">
                        <SectionC
                            handleSectionClick={this.handleSectionChange.bind(this)}
                            handleDeleteChildSectionOrQuestion={this.handleDeleteQuestionOrSection.bind(this)}
                            parentPath={this.state.activeSectionPath}
                            handleQuestionChange={this.handleQuestionUpdate.bind(this)}
                            section={this.state.activeSection} />
                    </div>
                    <Row style={{
                        position: "fixed",
                        height: "60px",
                        bottom: 0,
                        width: "100%",
                        margin: "0 auto"
                    }} className="fixed-footer">



                    </Row>
                </div>
            </Row>

        )
    }
}

