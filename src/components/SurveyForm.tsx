import React, { ReactNode, useState } from "react";
import { QAQuestion } from "../form/question";
import { Classes, Button as Button_B, Icon, Intent, ITreeNode, Position, Tooltip, Tree, ButtonGroup, Collapse } from "@blueprintjs/core";
import { DPFormItem } from "./DPFormItem";
import { getRandomId } from "../utils/getRandomId";
import { AnswerType, QAType } from "../form/answer";
import { Row, Col, Button } from "reactstrap";
import { Toolbar } from "./Toolbar";
import { ALIGNMENT_LEFT } from "@blueprintjs/icons/lib/esm/generated/iconNames";
import { ANSWER_TYPES, QAValueType } from "./AnswerType";
import { testQuestion, testQuestion2, testQuestion3, testQuestion4, testQuestion5 } from "../testData/TestQuestions";

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

    setID(id: string) {
        this.id = id;
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
}

interface SurveyFormState {
    form: QuestionSection
}
interface SurveyFormProps {
    form: QuestionSection
}




export class SurveyForm_ extends React.Component<SurveyFormState, SurveyFormProps>{
    static defaultProps = {
        form: new QuestionSection().setContent([testQuestion, testQuestion2, testQuestion3, new QuestionSection().setContent([testQuestion4, testQuestion5]).setName("true things")]),
    }
    constructor(props: SurveyFormProps) {
        super(props);
        this.state = {
            form: this.props.form
        }
    }

    render() {
        return (
            <Row>
                <Toolbar></Toolbar>
                <div className="container">

                    <div style={{ background: "transparent" }} className="sidebar">
                        <div className="sidebar-wrapper">
                            <FormTree form={this.state.form} />
                        </div>
                    </div>
                    <div className="content">
                        <SectionC section={this.state.form} />
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
    nodes: ITreeNode[]
}
interface FormTreeProps {
    form: SurveyForm
}
export class FormTree extends React.Component<FormTreeProps, FormTreeState>{
    constructor(props: FormTreeProps) {
        super(props);
        this.state = {
            nodes: this.generateITNodeTree(this.props.form)
        }
    }
    private handleNodeClick = (nodeData: ITreeNode, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);
    };

    private handleNodeCollapse = (nodeData: ITreeNode) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    private handleNodeExpand = (nodeData: ITreeNode) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

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

    generateITNodeTree(form: SurveyForm): ITreeNode[] {
        function getFormContent(item: QuestionSection | QAQuestion, sectionNumber: string) {
            let def: ITreeNode = {
                id: item.id,
                icon: undefined,
                label: ""
            };
            if (item instanceof QAQuestion) {
                def.icon = "document"
                def.label = sectionNumber + " " + "Question";
            }
            else if (item instanceof QuestionSection) {
                def.icon = "folder-close"
                def.label = sectionNumber + " " + item.name || "Section";
                def.childNodes = item.content.map((it, ind) => getFormContent(it, sectionNumber + "." + (ind + 1)))

            }
            return def;
        }

        let root: ITreeNode = {
            id: 0,
            hasCaret: true,
            icon: "folder-close",
            label: form.name,
            isExpanded: true,
            childNodes: form.content.map((it, ind) => getFormContent(it, (ind + 1).toString()))
        }
        return [root];
    }
    render() {
        return <Tree contents={this.state.nodes}
            onNodeClick={this.handleNodeClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
            className={Classes.ELEVATION_0} />

    }
}
interface SectionCProps {
    section: QuestionSection
}
interface SectionCState {

}
class SectionC extends React.Component<SectionCProps, SectionCState>{
    constructor(props: SectionCProps) {
        super(props);
        this.state = {

        }
    }
    render() {
        let comp = null;
        comp = this.props.section.content.map(item => {
            if (item instanceof QAQuestion) {
                return <QuestionButton isExpanded={false}>
                    <DPFormItem/>
                </QuestionButton>
            }
            else if (item instanceof QuestionSection) {
                return <SectionButton onClick={() => console.log("Sdf")}></SectionButton>
            }
        })
        return (
            <ButtonGroup fill  vertical>
               { comp}
    
            </ButtonGroup>

        )
    }
}
interface QuestionButtonProps {
    isExpanded: boolean,
    children: ReactNode
}
const QuestionButton = (props: QuestionButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <ButtonGroup className="bp3-dark" style={{paddingBottom: "50px"}} fill vertical>
            <Button_B  style={{height:50}} onClick={() => setIsExpanded(!isExpanded)} alignText={"left"} text="Question:" rightIcon={isExpanded?"chevron-up":"chevron-down"}></Button_B>
            <Collapse keepChildrenMounted={false} isOpen={isExpanded}>
                {props.children}
            </Collapse>
        </ButtonGroup>
    )
}

interface SectionButtonProps {
    onClick: (e: React.MouseEvent) => void,
}
const SectionButton = (props: SectionButtonProps) => {
    return (
        <ButtonGroup className="bp3-dark" style={{paddingBottom: "50px"}} fill vertical>
            <Button_B style={{height:50}} alignText="left" onClick={props.onClick} text="Section:" rightIcon={"folder-open"}></Button_B>
        </ButtonGroup>
    )
}
