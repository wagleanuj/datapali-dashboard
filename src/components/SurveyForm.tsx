import React from "react";
import { QAQuestion } from "../form/question";
import { Classes, Button as BTN, Icon, Intent, ITreeNode, Position, Tooltip, Tree, ButtonGroup } from "@blueprintjs/core";
import { DPFormItem } from "./DPFormItem";
import { getRandomId } from "../utils/getRandomId";
import { AnswerType, QAType } from "../form/answer";
import { Row, Col, Button } from "reactstrap";

export class SurveyForm {
    content!: (SurveySection | QAQuestion)[];
    id: string;
    name!: string;
    constructor() {
        this.id = getRandomId("sf-");
    }
    setName(name: string) {
        this.name = name;
        return this;
    }

    setContent(content: (SurveySection | QAQuestion)[]) {
        this.content = content;
        return this;
    }

    setID(id: string) {
        this.id = id;
        return this;
    }

    addContent(content: QAQuestion | SurveySection) {
        this.content.push(content);
        return this;
    }

}

export class SurveySection {
    name!: string;
    content!: (SurveySection | QAQuestion)[]
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
    setContent(content: (SurveySection | QAQuestion)[]) {
        this.content = content;
        return this;
    }

    addContent(content: SurveySection | QAQuestion) {
        this.content.push(content);
        return this;
    }
}

interface SurveyFormState {
    form: SurveyForm
}
interface SurveyFormProps {
    form: SurveyForm
}


const testQuestion = new QAQuestion().setAnswerType(AnswerType.Select).setQuestionContent({ type: QAType.String, content: "what is your cat's name?" }).setReferenceId("question-1");
for (let i = 0; i < 5; i++) { testQuestion.addOption({ value: `cat${i}` }) }
const testQuestion2 = new QAQuestion().setAnswerType(AnswerType.Select).setQuestionContent({ type: QAType.String, content: "what is your favorite tv?" }).setReferenceId("question-2");
for (let i = 0; i < 5; i++) { testQuestion2.addOption({ value: `tv${i}` }) }

const testQuestion3 = new QAQuestion().setAnswerType(AnswerType.Boolean).setQuestionContent({ type: QAType.String, content: "Do you like having sex?" }).setReferenceId("question-3");
const testQuestion4 = new QAQuestion().setAnswerType(AnswerType.Number).setQuestionContent({ type: QAType.String, content: "How many times have you had HIV AIDS?" }).setReferenceId("question-4");
const testQuestion5 = new QAQuestion().setAnswerType(AnswerType.String).setQuestionContent({ type: QAType.String, content: "Who taught you how to have sex?" }).setReferenceId("question-5");


export class SurveyForm_ extends React.Component<SurveyFormState, SurveyFormProps>{
    static defaultProps = {
        form: { id: "12", content: [testQuestion, testQuestion2, testQuestion3, new SurveySection().setContent([testQuestion4, testQuestion5]).setName("true things")] }
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
                <div className="container">

                    <div style={{ background: "transparent" }} className="sidebar">
                        <div className="sidebar-wrapper">
                            <FormTree form={this.state.form} />
                        </div>
                    </div>
                    <div className="content">
                        <DPFormItem />
                    </div>
                    <Row style={{
                        position: "fixed",
                        height: "60px",
                        bottom: 0,
                        width: "100%"
                    }} className="fixed-footer">

                        <ButtonGroup fill={true} vertical ={false}>
                            <BTN text="Add Question"></BTN>
                            <BTN text="Add Question"></BTN>

                        </ButtonGroup>


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
        function getFormContent(item: SurveySection | QAQuestion, sectionNumber: string) {
            let def: ITreeNode = {
                id: item.id,
                icon: undefined,
                label: ""
            };
            if (item instanceof QAQuestion) {
                def.icon = "document"
                def.label = sectionNumber + " " + "Question";
            }
            else if (item instanceof SurveySection) {
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


