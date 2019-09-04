import React, { ReactNode, useState } from "react";
import { QAQuestion } from "../form/question";
import { Classes, Button as Button_B, Icon, Intent, ITreeNode, Position, Tooltip, Tree, ButtonGroup, Collapse, IconName, Pre } from "@blueprintjs/core";
import { DPFormItem } from "./DPFormItem";
import { getRandomId } from "../utils/getRandomId";
import { AnswerType, QAType } from "../form/answer";
import { Row, Col, Button, Label, Badge } from "reactstrap";
import { Toolbar } from "./Toolbar";
import { ALIGNMENT_LEFT } from "@blueprintjs/icons/lib/esm/generated/iconNames";
import { ANSWER_TYPES, QAValueType } from "./AnswerType";
import { testQuestion, testQuestion2, testQuestion3, testQuestion4, testQuestion5 } from "../testData/TestQuestions";
import _ from "lodash";

export class SurveyForm {
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
    treeNodes: ITreeNode[],

}
interface SurveyFormProps {
    form: QuestionSection,
    onChange: (form: QuestionSection) => void
}


const TreeF = Tree.ofType<QuestionSection>();


export class SurveyForm_ extends React.Component<SurveyFormProps, SurveyFormState>{
    static defaultProps = {
        form: new QuestionSection().setContent([testQuestion, testQuestion2, testQuestion3, new QuestionSection().setContent([testQuestion4, testQuestion5]).setName("true things")]),
    }
    public static questionOrSectionFromPath(path: number[], root: (QuestionSection | QAQuestion)[]): QuestionSection | QAQuestion {
        let el = root[path[0]];
        if (path.length === 1) {
            return el;
        } else {
            return SurveyForm_.questionOrSectionFromPath(path.slice(1), el.content);
        }
    }
    constructor(props: SurveyFormProps) {
        super(props);
        this.state = {
            form: this.props.form,
            activeSection: this.props.form,
            treeNodes: this.generateITNodeTree(this.props.form),
            activeSectionPath: [0]
        }
    }

    getNodeFromQuestionOrSection(item: QuestionSection | QAQuestion, sectionNumber: string) {
        let def: ITreeNode = {
            id: item.id,
            icon: undefined,
            label: "",
        };
        if (item instanceof QAQuestion) {
            def.icon = "document"
            def.label = sectionNumber + " " + "Question";
        }
        else if (item instanceof QuestionSection) {
            def.icon = "folder-close"
            def.label = sectionNumber + " " + (item.name || "Section");
            def.childNodes = item.content.map((it, ind) => this.getNodeFromQuestionOrSection(it, sectionNumber + "." + (ind + 1)))

        }
        return def;
    }

    generateITNodeTree(form: SurveyForm): ITreeNode[] {
        let root: ITreeNode = {
            id: 0,
            hasCaret: true,
            icon: "folder-close",
            label: form.name,
            isExpanded: true,
            childNodes: form.content.map((it, ind) => this.getNodeFromQuestionOrSection(it, (ind + 1).toString()))
        }
        return [root];
    }

    addSectionToNodeTree(_nodePath: number[], section: QuestionSection) {
        let node = Tree.nodeFromPath(_nodePath, this.state.treeNodes);
        if (node.childNodes) {
            let readablePath = getReadablePath(this.state.activeSectionPath);
            if (readablePath) readablePath += ".";
            node.childNodes.push(this.getNodeFromQuestionOrSection(section, readablePath + (node.childNodes.length + 1).toString()))
        }

        return this.state;
    }


    deleteNodeFromNodeTree(_nodePath: number[], id: string) {
        let node = Tree.nodeFromPath(_nodePath, this.state.treeNodes);
        if (node.childNodes) {
            let foundIndex = node.childNodes.findIndex(item => item.id === id);
            if (foundIndex > -1) {
                node.childNodes.splice(foundIndex, 1)
            }
        }
        return this.state;
    }

    addQuestionToNodeTree(_nodePath: number[], section: QAQuestion) {
        let node = Tree.nodeFromPath(_nodePath, this.state.treeNodes);
        if (node.childNodes) {
            let readablePath = getReadablePath(this.state.activeSectionPath);
            if (readablePath) readablePath += ".";
            node.childNodes.push(this.getNodeFromQuestionOrSection(section, readablePath + (node.childNodes.length + 1).toString()))
        }
        return this.state;
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
            let toAddIn = SurveyForm_.questionOrSectionFromPath(this.state.activeSectionPath, [cloned]);
            if (toAddIn instanceof QAQuestion) {
                return {

                }
            }
            let newsection = new QuestionSection();
            toAddIn.addContent(new QuestionSection());
            this.addSectionToNodeTree(this.state.activeSectionPath, newsection);
            return {
                ...this.state,
                form: cloned
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.form);
        })
    }

    handleAddQuestion() {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.form);
            let toAddIn = SurveyForm_.questionOrSectionFromPath(this.state.activeSectionPath, [cloned]);
            if (toAddIn instanceof QAQuestion) {
                return {

                }
            }
            let q = new QAQuestion();
            toAddIn.addContent(new QAQuestion());

            this.addQuestionToNodeTree(this.state.activeSectionPath, q)

            return {
                ...this.state,
                form: cloned,
            }
        }, () => {
            if (this.props.onChange) this.props.onChange(this.state.form);
        })
    }
    handleDeleteQuestionOrSection(deleteid: string) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.form);
            cloned.deleteContent(deleteid);

            this.deleteNodeFromNodeTree(this.state.activeSectionPath, deleteid)

            return {
                ...this.state,
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

    handleQuestionUpdate(question: QAQuestion) {
        this.setState((prevState: SurveyFormState) => {
            let cloned = _.clone(prevState.form);
            let foundQ = cloned.content.find(item => item.id === question.id);
            if (foundQ && foundQ instanceof QAQuestion) {
                foundQ.updateFromQuestion(question);
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

    handleFormTreeNodeExpand(nodeData: ITreeNode) {
        nodeData.isExpanded = true;
        this.setState(this.state);

    }

    handleFormTreeNodeCollapse(nodeData: ITreeNode) {
        nodeData.isExpanded = false;
        this.setState(this.state);
    }


    handleFormTreeNodeClick(nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) {
        console.log(_nodePath);
        const initiallySelected = !!nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.treeNodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = !initiallySelected;
        let item = SurveyForm_.questionOrSectionFromPath(_nodePath, [this.state.form]);
        console.log(item)
        if (item instanceof QuestionSection) {
            this.setState((prevState: SurveyFormState) => {

                return {
                    ...this.state,
                    activeSection: item instanceof QuestionSection ? item : prevState.activeSection,
                    activeSectionPath: _nodePath
                }

            })
        }



    }

    render() {

        return (
            <Row>
                <Toolbar handleItemClick={this.handleToolbarItemClick.bind(this)}></Toolbar>
                <div className="container">

                    <div style={{ background: "transparent" }} className="sidebar">
                        <div className="sidebar-wrapper">
                            <FormTree handleNodeExpand={this.handleFormTreeNodeExpand.bind(this)} handleNodeCollapse={this.handleFormTreeNodeCollapse.bind(this)} handleNodeClick={this.handleFormTreeNodeClick.bind(this)} nodes={this.state.treeNodes} />
                        </div>
                    </div>
                    <div className="content">
                        <SectionC handleDeleteChildSectionOrQuestion={this.handleDeleteQuestionOrSection.bind(this)} parentPath={this.state.activeSectionPath} handleQuestionChange={this.handleQuestionUpdate.bind(this)} section={this.state.activeSection} />
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
interface FormTreeState {
}
interface FormTreeProps {
    nodes: ITreeNode[],
    handleNodeClick?: (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => void,
    handleNodeCollapse?: (nodeData: ITreeNode) => void,
    handleNodeExpand?: (nodeData: ITreeNode) => void,

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

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        if (this.props.handleNodeCollapse) this.props.handleNodeCollapse(nodeData);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        if (this.props.handleNodeExpand) this.props.handleNodeExpand(nodeData);
    };

    render() {
        return <Tree contents={this.props.nodes}
            onNodeClick={this.handleNodeClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
            className={Classes.ELEVATION_0} />

    }
}
interface SectionCProps {
    section: QuestionSection,
    handleQuestionChange: (question: QAQuestion) => void,
    parentPath: number[],
    handleDeleteChildSectionOrQuestion: (deleteid: string) => void,
}
interface SectionCState {
}
class SectionC extends React.Component<SectionCProps, SectionCState>{
    constructor(props: SectionCProps) {
        super(props);
        this.state = {
        }
    }

    handleQuestionChange(q: QAQuestion) {
        if (this.props.handleQuestionChange) this.props.handleQuestionChange(q);
    }



    render() {
        let comp = null;
        let readablePath = getReadablePath(this.props.parentPath);
        if (readablePath) readablePath += ".";
        comp = this.props.section.content.map((item, index) => {
            if (item instanceof QAQuestion) {
                return <QuestionButton questionId={item.id} handleDeletion={this.props.handleDeleteChildSectionOrQuestion} path={readablePath + (index + 1)} key={item.id} isExpanded={false}>
                    <DPFormItem onChange={this.handleQuestionChange.bind(this)} question={item} />
                </QuestionButton>
            }
            else if (item instanceof QuestionSection) {
                return <SectionButton handleDeletion={this.props.handleDeleteChildSectionOrQuestion} sectionId={item.id} path={readablePath + (index + 1)} key={item.id} onClick={() => console.log("Sdf")}></SectionButton>
            }
        })
        return (
            <ButtonGroup fill vertical>
                {comp}

            </ButtonGroup>

        )
    }
}
interface QuestionButtonProps {
    questionId: string,
    isExpanded: boolean,
    children: ReactNode,
    path?: string,
    handleDeletion: (id: string) => void,
}
const QuestionButton = (props: QuestionButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <ButtonGroup className="bp3-dark" style={{ paddingBottom: "20px" }} fill vertical>
            <ButtonGroup>
                <Button_B style={{ height: 50 }} onClick={() => setIsExpanded(!isExpanded)} alignText={"left"} rightIcon={isExpanded ? "chevron-up" : "chevron-down"}><Badge color="secondary">Q</Badge> <span>{props.path + " Question"} </span></Button_B>
                <Button_B onClick={() => props.handleDeletion(props.questionId)} style={{ height: 50, width: 20 }} alignText="left" rightIcon={"cross"} />
            </ButtonGroup>
            <Collapse keepChildrenMounted={false} isOpen={isExpanded}>
                {props.children}
            </Collapse>
        </ButtonGroup>
    )
}

interface SectionButtonProps {
    sectionId: string,
    onClick: (e: React.MouseEvent) => void,
    path?: string,
    handleDeletion: (id: string) => void

}
const SectionButton = (props: SectionButtonProps) => {
    return (
        <ButtonGroup className="bp3-dark" style={{ paddingBottom: "20px" }} fill >
            <Button_B style={{ height: 50 }} alignText="left" onClick={props.onClick} rightIcon={"folder-open"}><Badge color="secondary">S</Badge> <span>{props.path + " Section"} </span></Button_B>
            <Button_B onClick={() => props.handleDeletion(props.sectionId)} style={{ height: 50, width: 20 }} alignText="left"  rightIcon={"cross"} />

        </ButtonGroup>
    )
}




function getReadablePath(nu: number[]) {
    return nu.slice(1).map(item => item + 1).join(".");

}