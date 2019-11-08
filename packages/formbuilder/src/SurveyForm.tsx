
import { EditableText, Intent, IToastProps, ITreeNode, Toaster } from "@blueprintjs/core";
import copy from "copy-to-clipboard";
import { Constants, IDupeSettings, ILiteral, QAQuestion, QORS, QuestionSection, request, RootSection } from "@datapali/dpform";
import _ from "lodash";
import React from "react";
import { Row } from "reactstrap";
import { CONFIG } from "./APPCONFIG";
import { ConstantDefinitions } from "./constants";
import { FormTree } from "./formtree";
import { SectionC } from "./section";
import { Toolbar } from "./Toolbar";




interface SurveyFormState {
    activeSection: QuestionSection | RootSection,
    activeSectionPath: number[]
    selectedNodes: string[],
    expandedNodes: string[],
    root?: RootSection,
    constants: Constants,

}
interface SurveyFormProps {
    root: RootSection;
    onChange: (root: RootSection) => void;
    token: string;
    onSave: (root: RootSection)=>void;


}


export class SurveyForm extends React.Component<SurveyFormProps, SurveyFormState>{

    private toasterRef!: Toaster;

    constructor(props: SurveyFormProps) {
        super(props);
        this.state = {
            selectedNodes: [],
            expandedNodes: [this.props.root.id],
            root: this.props.root|| new RootSection(),
            activeSection: this.props.root,
            activeSectionPath: [0],
            constants: new Constants(),
        }
    }
    componentDidMount() {
    }

    loadForm() {
        let requestBody = {
            query: `
            query GetForm($formId: [String]!){
                forms(id: $formId){
                  id
                  name
                  content
                }
              }`,
            variables: {
                formId: "root-53c37497-3808-cfd8-c886-1361dbaab171"
            }
        }
        let token = this.props.token;
        return request(CONFIG.PROD_SERVER, "forms", requestBody, "Could not delete the game file", token).then(file => {
            file = file[0]
            if (file) {
                file.content = JSON.parse(file.content);
                console.log(file.id);

                let root: RootSection = RootSection.fromJSON(file);
                let valbag: (QuestionSection | QAQuestion)[] = []
                let iterated = this.getAllEntries([0, 1], 6, root, null, true, valbag);
                console.log(iterated);
                // let ir = this.Iterator2(root, [0], 0, QORS.QUESTION);
                this.setState({
                    root: root,
                    activeSection: root,
                    activeSectionPath: [0]
                })
            }
        });
    }

    getAllEntries(startSectionPath: number[], startIndex: number, root: RootSection, fetchType: QORS | null, first: boolean = true, returnbag?: (QuestionSection | QAQuestion)[]) {
        if (!returnbag) returnbag = [];
        if (startSectionPath.length <= 0) return;
        let section = RootSection.getFromPath(startSectionPath, [root]);
        if (!section) return;
        for (let i = startIndex; i < section.content.length; i++) {
            let current = section.content[i];
            if (current instanceof QAQuestion) {
                if (fetchType === QORS.QUESTION || !fetchType) returnbag.push(current);

            }
            else if (current instanceof QuestionSection) {
                if (fetchType === QORS.SECTION || !fetchType) returnbag.push(current);
                this.getAllEntries(startSectionPath.concat(i), 0, root, fetchType, false, returnbag);
            }
        }
        if (first) {
            let cloned = startSectionPath.slice(0);
            let index = cloned.pop();
            if (typeof (index) === "number") {
                this.getAllEntries(cloned, index, root, fetchType, true, returnbag);
            }
        }
        return returnbag;
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
            if (item && deleteid !== item.id) throw new Error("cannot delete, id mismatch");
            if (item instanceof QAQuestion) {
                cloned.removeQuestion(item.id, path_);
            }
            else if (item instanceof QuestionSection) {
                cloned.removeSection(item.id, path_);
                if (item.id === prevState.activeSection.id) {
                    let parentSection = RootSection.getFromPath(parent, [this.state.root]);
                    if (parentSection && !(parentSection instanceof QAQuestion)) {
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
            if (newSection && !(newSection instanceof QAQuestion)) {
                this.setState((prevState: SurveyFormState) => {
                    return {
                        activeSection: !newSection ? prevState.activeSection : newSection instanceof QAQuestion ? prevState.activeSection : newSection,
                        activeSectionPath: newSectionPath
                    }

                })
            }
        }
    }
    private handleSave() {
        // let file = RootSection.toJSON(this.state.root);
        // file.content = JSON.stringify(file.content);
        // if (!file.name) file.name = "Main Form";
        // let requestBody = {
        //     query: `
        //     mutation SaveForm($saveFile: FormFileInput!){
        //         saveForm(form: $saveFile){
        //           id
        //         }
        //       }`,
        //     variables: {
        //         saveFile: file
        //     }
        // }
        // let token = this.props.token;
        // return request(CONFIG.PROD_SERVER, "saveForm", requestBody, "Could not save the  file", token).then(re => console.log(re));
        if(this.props.onSave) this.props.onSave(this.state.root);
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
        let item = RootSection.getFromPath(_nodePath, [this.state.root]);
        if (item) {
            this.setState((prevState: SurveyFormState) => {
                let expandedNodes = item ? _.union([item.id], prevState.expandedNodes) : prevState.expandedNodes;
                return {
                    expandedNodes: expandedNodes
                }
            })
        }
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
        if (item && !(item instanceof QAQuestion)) {
            this.setState((prevState: SurveyFormState) => {

                let expandedNodes = item ? _.union([item.id], prevState.expandedNodes) : prevState.expandedNodes;
                let selectedNodes = item ? [item.id] : prevState.selectedNodes;
                return {
                    selectedNodes: selectedNodes,
                    expandedNodes: expandedNodes,
                    activeSection: item && !(item instanceof QAQuestion) ? item : prevState.activeSection,
                    activeSectionPath: _nodePath
                }

            })
        }
        else if (item) {
            this.setState((prevState: SurveyFormState) => {
                let parent = _nodePath.length > 1 ? _nodePath.slice(0, _nodePath.length - 1) : _nodePath;
                let parentSection = RootSection.getFromPath(parent, [prevState.root]);
                let selectedQuestion = RootSection.getFromPath(_nodePath, [prevState.root]);
                let expandedNodes = prevState.expandedNodes;
                let selectedNodes = selectedQuestion ? [selectedQuestion.id] : prevState.selectedNodes;
                if (parentSection && !(parentSection instanceof QAQuestion)) {
                    expandedNodes = _.union([parentSection.id], expandedNodes);
                    selectedNodes.push(parentSection.id);
                }

                return {
                    expandedNodes: expandedNodes,
                    selectedNodes: selectedNodes,
                    activeSection: parentSection && !(parentSection instanceof QAQuestion) ? parentSection : prevState.activeSection,
                    activeSectionPath: parent
                }


            })
        }
    }
    handleRootNameChange(newName: string) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            cloned.name = newName;
            return {
                root: cloned
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.root);
        })
    }

    handleSectionChange(id: string, path: number[]) {
        this.setState((prevState: SurveyFormState) => {
            let section = RootSection.getFromPath(path, [prevState.root]);
            let expandedNodes = prevState.expandedNodes;
            let selectedNodes = []
            if (section && section instanceof QuestionSection) {
                expandedNodes = _.union([section.id], expandedNodes);
                selectedNodes.push(section.id);
            }
            return {
                expandedNodes: expandedNodes,
                selectedNodes: selectedNodes,
                activeSection: section && !(section instanceof QAQuestion) ? section : prevState.activeSection,
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
            cloned.moveItem(path, newPath);
            return {
                root: cloned
            }
        })
    }
    handleSectionConditionChange(sectionId: string, literals: ILiteral[]) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            cloned.sections[sectionId].appearingCondition.setLiterals(literals);
            return {
                root: cloned
            }
        });
    }

    handleSectionCustomIdChange(sectionId: string, v: string) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.root);
            cloned.sections[sectionId].customId = v;

            return {
                root: cloned
            }
        });
    }
    render() {

        return (
            <Row>
                <Toaster ref={r => r ? this.toasterRef = r : null}></Toaster>
                <ConstantDefinitions isOpen={false}></ConstantDefinitions>
                <Toolbar handleItemClick={this.handleToolbarItemClick.bind(this)}>
                    <EditableText value={this.state.root.name} onChange={this.handleRootNameChange.bind(this)} />

                </Toolbar>
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
                            handleSectionCustomIdChange={this.handleSectionCustomIdChange.bind(this)}
                            handleSectionConditionChange={this.handleSectionConditionChange.bind(this)}
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

