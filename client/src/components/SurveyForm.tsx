
import React from "react";
import { Toaster, IToastProps, Intent, ITreeNode } from "@blueprintjs/core";
import _ from "lodash";
import { Row } from "reactstrap";
import { ConstantDefinitions } from "./constants";
import { Toolbar } from "./Toolbar";
import { FormTree } from "./formtree";
import { SectionC } from "./section";

import copy from "copy-to-clipboard";
import { QuestionSection, RootSection, Constants, QAQuestion, IDupeSettings, request, QORS } from "@dpForm/dist";



interface SurveyFormState {
    activeSection: QuestionSection | RootSection,
    activeSectionPath: number[]
    selectedNodes: string[],
    expandedNodes: string[],
    root: RootSection,
    constants: Constants,

}
interface SurveyFormProps {
    root: RootSection,
    onChange: (root: RootSection) => void
}


export class SurveyForm extends React.Component<SurveyFormProps, SurveyFormState>{

    private toasterRef!: Toaster;

    constructor(props: SurveyFormProps) {
        super(props);
        this.state = {
            selectedNodes: [],
            expandedNodes: [this.props.root.id],
            root: this.props.root,
            activeSection: this.props.root,
            activeSectionPath: [0],
            constants: new Constants(),
        }
    }
    componentDidMount() {
        this.loadForm();
    }

    loadForm() {
        let requestBody = {
            query: `
            query GetForm($formId: String!){
                forms(id: $formId){
                  id
                  name
                  content
                }
              }`,
            variables: {
                formId: "root-5eadfe10-ed7a-3898-769b-490bbd5d849e"
            }
        }
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgxMzc3MjAsImV4cCI6MTU2ODIyNDEyMH0.pFUxpkVIiQ8osj8dSHHzOLhd4_8Idf6Trq9XnbBiwDc";
        return request("http://localhost:5000/graphql", "forms", requestBody, "Could not delete the game file", token).then(file => {
            file = file[0]
            if (file) {
                file.content = JSON.parse(file.content);
                console.log(file.id);

                let root: RootSection = RootSection.fromJSON(file);
                // let ir = this.Iterator2(root, [0], 0, QORS.QUESTION);
                console.log(ir.map((item:any)=>item.data));
                this.setState({
                    root: root,
                    activeSection: root,
                    activeSectionPath: [0]
                })
            }
        });
    }
    
    handleAddSection() {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            cloned.addSection(this.state.activeSectionPath);
            return {
                root: cloned
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.root);
        })
    }

    handleAddQuestion() {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            cloned.addQuestion(this.state.activeSectionPath);
            return {
                root: cloned,
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.root);
        })
    }
    handleDeleteQuestionOrSection(deleteid: string, path_: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let activeSection = prevState.activeSection;
            let activeSectionPath = prevState.activeSectionPath;
            let parent = path_.slice(0, path_.length - 1);
            let cloned = _.clone(prevState.root);
            let item = RootSection.getFromPath(path_, [this.state.root]);
            if (deleteid !== item.id) throw new Error("cannot delete, id mismatch");
            if (item instanceof QAQuestion) {
                cloned.removeQuestion(item.id, path_);
            }
            else if (item instanceof QuestionSection) {
                cloned.removeSection(item.id, path_);
                if (item.id === prevState.activeSection.id) {
                    let parentSection = RootSection.getFromPath(parent, [this.state.root]);
                    if (!(parentSection instanceof QAQuestion)) {
                        activeSection = parentSection;
                        activeSectionPath = parent;
                    }
                }
            }

            return {
                root: cloned,
                activeSection: activeSection,
                activeSectionPath: activeSectionPath
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.root);
        })
    }
    private handleUpOneLevel() {

        if (this.state.activeSectionPath.length > 1) {
            let newSectionPath = this.state.activeSectionPath.slice(0, this.state.activeSectionPath.length - 1);
            let newSection = RootSection.getFromPath(newSectionPath, [this.state.root]);
            if (!(newSection instanceof QAQuestion)) {
                this.setState((prevState: SurveyFormState) => {
                    return {
                        activeSection: newSection instanceof QAQuestion ? prevState.activeSection : newSection,
                        activeSectionPath: newSectionPath
                    }

                })
            }
        }
    }
    private handleSave() {
        let file = RootSection.toJSON(this.state.root);
        file.content = JSON.stringify(file.content);
        console.log(file);
        let requestBody = {
            query: `
            mutation SaveForm($saveFile: RootSectionInput!){
                saveForm(form: $saveFile){
                  id
                }
              }`,
            variables: {
                saveFile: file
            }
        }
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgxMzc3MjAsImV4cCI6MTU2ODIyNDEyMH0.pFUxpkVIiQ8osj8dSHHzOLhd4_8Idf6Trq9XnbBiwDc";

        return request("http://localhost:5000/graphql", "saveForm", requestBody, "Could not delete the game file", token).then(re => console.log(re));
    }


    handleToolbarItemClick(name: string) {
        switch (name) {
            case "add-section":
                this.handleAddSection()
                break;
            case "add-question":
                this.handleAddQuestion();
                break;
            case "up-one-level":
                this.handleUpOneLevel();
                break;
            case "save-root":
                this.handleSave();
                break;

            case "copy-state":
                let data = JSON.stringify(RootSection.toJSON(this.state.root));
                copy(data);
                let toast: IToastProps = {
                    message: "Copied state to clipboard",
                    icon: "tick",
                    intent: Intent.SUCCESS,
                }
                this.toasterRef.show(toast)


                break;
        }
    }

    handleQuestionUpdate(question: QAQuestion, path: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            let parent = path.slice(0, path.length - 1);
            let parentSection = RootSection.getFromPath(parent, [cloned]);
            if (!(parentSection instanceof QAQuestion)) {
                let q = this.state.root.questions[question.id];
                q.updateFromQuestion(question);

            }

            return {
                root: cloned
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.root);
        })
    }


    handleFormTreeNodeExpand(nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) {
        nodeData.isExpanded = true;
        this.setState((prevState: SurveyFormState) => {
            let item = RootSection.getFromPath(_nodePath, [this.state.root]);
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
        let item = RootSection.getFromPath(_nodePath, [this.state.root]);
        if (!(item instanceof QAQuestion)) {
            this.setState((prevState: SurveyFormState) => {
                let expandedNodes = _.union([item.id], prevState.expandedNodes);
                let selectedNodes = [item.id];
                return {
                    selectedNodes: selectedNodes,
                    expandedNodes: expandedNodes,
                    activeSection: !(item instanceof QAQuestion) ? item : prevState.activeSection,
                    activeSectionPath: _nodePath
                }

            })
        }
        else {
            this.setState((prevState: SurveyFormState) => {

                let parent = _nodePath.length > 1 ? _nodePath.slice(0, _nodePath.length - 1) : _nodePath;
                let parentSection = RootSection.getFromPath(parent, [prevState.root]);
                let selectedQuestion = RootSection.getFromPath(_nodePath, [prevState.root]);
                let expandedNodes = prevState.expandedNodes;
                let selectedNodes = [selectedQuestion.id];
                if (!(parentSection instanceof QAQuestion)) {
                    expandedNodes = _.union([parentSection.id], expandedNodes);
                    selectedNodes.push(parentSection.id);
                }

                return {
                    expandedNodes: expandedNodes,
                    selectedNodes: selectedNodes,
                    activeSection: !(parentSection instanceof QAQuestion) ? parentSection : prevState.activeSection,
                    activeSectionPath: parent
                }


            })
        }
    }

    handleSectionChange(id: string, path: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let section = RootSection.getFromPath(path, [prevState.root]);
            let expandedNodes = prevState.expandedNodes;
            let selectedNodes = []
            if (section instanceof QuestionSection) {
                expandedNodes = _.union([section.id], expandedNodes);
                selectedNodes.push(section.id);
            }
            return {
                expandedNodes: expandedNodes,
                selectedNodes: selectedNodes,
                activeSection: !(section instanceof QAQuestion) ? section : prevState.activeSection,
                activeSectionPath: path
            }
        })
    }
    handleDuplicatingSettingsChange(id: string, dupe: IDupeSettings) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            cloned.sections[id].setDuplicatingSettings(dupe);
            return {
                root: cloned
            }
        })
    }
    handleSectionNameChange(id: string, v: string) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            let item = cloned.sections[id];
            item.name = v;
            return {
                root: cloned
            }
        })
    }
    handleMoveUp(id: string, path: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            let newPath = _.clone(path);
            if (newPath[newPath.length - 1] > 0) {
                newPath[newPath.length - 1] = newPath[newPath.length - 1] - 1;
            }
            console.log(newPath, path)
            cloned.moveItem(path, newPath);
            return {
                root: cloned
            }
        })
    }
    render() {

        return (
            <Row>
                <Toaster ref={r => r ? this.toasterRef = r : null}></Toaster>
                <ConstantDefinitions isOpen={false}></ConstantDefinitions>
                <Toolbar handleItemClick={this.handleToolbarItemClick.bind(this)}></Toolbar>
                <div className="container">

                    <div style={{ background: "transparent" }} className="sidebar">
                        <div className="sidebar-wrapper">
                            <FormTree
                                expandedNodes={this.state.expandedNodes}
                                selectedNodes={this.state.selectedNodes}
                                handleNodeExpand={this.handleFormTreeNodeExpand.bind(this)}
                                handleNodeCollapse={this.handleFormTreeNodeCollapse.bind(this)}
                                handleNodeClick={this.handleFormTreeNodeClick.bind(this)}
                                root_={this.state.root}
                            />
                        </div>
                    </div>
                    <div className="content">
                        <SectionC
                            handleMoveUp={this.handleMoveUp.bind(this)}
                            constants={this.state.constants}
                            handleSectionNameChange={this.handleSectionNameChange.bind(this)}
                            definedQuestions={(this.state.root.questions)}
                            handleSectionDuplicatingSettingsChange={this.handleDuplicatingSettingsChange.bind(this)}
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

