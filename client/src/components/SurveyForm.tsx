import React, { RefObject } from "react";
import { QAQuestion } from "../form/question";
import { ITreeNode, Toaster, IToastProps, Intent } from "@blueprintjs/core";
import { getRandomId } from "../utils/getRandomId";
import { Row } from "reactstrap";
import { Toolbar } from "./Toolbar";

import { testQuestion, testQuestion2, testQuestion3, testQuestion4, testQuestion5 } from "../testData/TestQuestions";
import _ from "lodash";
import { SectionC, RootSection } from "./section";
import { FormTree } from "./formtree";
import { QACondition } from "../form/condition";
import { IDupeSettings } from "./duplicateSettings";
import { dupeSettingsToJSON, request } from "../utils/util";
import { ConstantDefinitions, Constants } from "./constants";
import copy from "copy-to-clipboard"
export class QASurveyForm {
    content!: (QuestionSection | QAQuestion)[];
    id: string;
    name!: string;
    condition: QACondition;
    constructor() {
        this.id = getRandomId("sf-");
        this.condition = new QACondition()
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
    duplicatingSettings: IDupeSettings;
    condition: QACondition;
    constructor() {
        this.id = getRandomId("ss-");
        this.duplicatingSettings = { condition: undefined, isEnabled: false, duplicateTimes: { value: "", type: "number" } }
        this.content = []
        this.condition = new QACondition;

    }
    static toJSON(a: QuestionSection): any {
        return ({
            name: a.name,
            id: a.id,
            condition : QACondition.toJSON(a.condition),
            content: a.content.map(item => {
                if (item instanceof QuestionSection) {
                    return QuestionSection.toJSON(item)
                }
                else if (item instanceof QAQuestion) {
                    return QAQuestion.toJSON(item)
                }
            }),
            duplicatingSettings: dupeSettingsToJSON(a.duplicatingSettings)
        })
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
    setDuplicatingSettings(dupe: IDupeSettings) {
        this.duplicatingSettings = dupe;
        return this;
    }
}

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
export const rootSection = new RootSection().addSection([0]).addQuestion([0], [testQuestion]).addQuestion([0, 0], [testQuestion2, testQuestion3]);
console.log(rootSection);


export class SurveyForm extends React.Component<SurveyFormProps, SurveyFormState>{
    static defaultProps = {
        root: rootSection,
    }
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
    componentDidMount(){
        this.loadForm();
    }

    loadForm(){
        let requestBody = {
            query: `
            query GetForm{
                forms{
                  id
                  name
                  content
                }
              }`,
            variables: {
            }
          }
          let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgwNDk0NzksImV4cCI6MTU2ODEzNTg3OX0.zUP4kHxUVtLfHNkUSjswB62YtBAzZrUwmowdFPbM3Uw";
          return request("http://localhost:5000/graphql", "forms", requestBody, "Could not delete the game file", token ).then(res=>{
          let file= res[0];
            if(file){
              file.content = JSON.parse(file.content)[0];
              let root = RootSection.fromJSON(file);
              console.log(root);
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
        file.content =JSON.stringify(file.content);
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
          let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE1NjgwNDk0NzksImV4cCI6MTU2ODEzNTg3OX0.zUP4kHxUVtLfHNkUSjswB62YtBAzZrUwmowdFPbM3Uw";

          return request("http://localhost:5000/graphql", "saveForm", requestBody, "Could not delete the game file", token ).then(re=>console.log(re));
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

