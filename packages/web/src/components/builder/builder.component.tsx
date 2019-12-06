import { getRandomId, QACondition } from "@datapali/dpform";
import { Button, Card, Col, Divider, Dropdown, Icon, Layout, Menu, Row, Tree } from "antd";
import React from "react";
import { InjectedFormProps } from "redux-form";
import { IRootForm } from "../../types";
import { IQuestion, ISection, QUESTION, SECTION } from "../formfiller/types";
import { QuestionForm } from "./questionform.component";
import Rootsectionform from "./rootsectionform.component";
import Sectionform from "./sectionform.component";
import { ConnectedBuilderSidebar } from "./sidebartree.builder.container";
const { Header, Footer, Sider, Content } = Layout;
const { TreeNode } = Tree;

const defaultTree = {
    name: "Root",
    id: getRandomId("root-"),
    childNodes: [],
    _type: "root"
}
type BuilderProps = {
    handleMoveItemInForm?: (formId: string, itemId: string, parentId: string, newParentId: string) => void;
    handleDeleteItemInForm?: (formId: string, itemId: string, parentId: string) => void;
    handleAddItemInForm?: (rootId: string, parentId: string, item: ISection | IQuestion) => void;
    getNode?: (nodeId: string) => any;
    formId?: string;
    tree?: IRootForm;
}

type BuilderState = {
    selectedNode: string;
    currentSectionId: string;
}

export class Builder extends React.Component<BuilderProps & InjectedFormProps, BuilderState>{
    state = {
        selectedNode: this.props.initialValues[this.props.form],
        currentSectionId: this.props.form,
    }

    


    handleActionMenuItemClick = ({ key }) => {
        if (key === "add-section") {
            const section: ISection = {
                _type: SECTION,
                appearingCondition: new QACondition(),
                childNodes: [],
                customId: "",
                duplicatingSettings: { isEnabled: false, duplicateTimes: undefined },
                id: getRandomId("section-"),
                name: ""
            }
            this.props.change(section.id, section);
            const node = this.props.getNode(this.state.currentSectionId);
            const newChildren = [...new Set(node.childNodes).add(section.id)]
            this.props.change(`${this.state.currentSectionId}.childNodes`, newChildren)

        } else {
            const question: IQuestion = {
                _type: QUESTION,
                answerType: { name: undefined },
                creationDate: new Date().getTime(),
                customId: "",
                id: getRandomId("question-"),
                isRequired: true,
                options: {
                    optionGroupMap: {},
                    _type: "options",
                    optionsMap: {}
                },
                questionContent: {
                    content: "",
                    type: undefined
                }
            }
            this.props.change(question.id, question);
            const node = this.props.getNode(this.state.currentSectionId);
            const newChildren = [...new Set(node.childNodes).add(question.id)]
            this.props.change(`${this.state.currentSectionId}.childNodes`, newChildren)
        }
    }

    renderMenu = (
        <Menu onClick={this.handleActionMenuItemClick}>
            <Menu.Item key="add-section">Section</Menu.Item>
            <Menu.Item key="add-question">Question</Menu.Item>
        </Menu>
    );
    renderEditor = () => {
        if (!this.state.selectedNode) return null;
        if (this.state.selectedNode._type === "question") {
            return (
                <QuestionForm questionId={this.state.selectedNode.id} />
            )
        } else if (this.state.selectedNode._type === "section") {
            return (
                <Sectionform sectionId={this.state.selectedNode.id} />
            )

        } else if (this.state.selectedNode._type === "root") {
            return (
                <Rootsectionform rootId={this.state.selectedNode.id} />
            )
        }

    }

    render() {
        return (
            <Card>
                <Row>
                    <Row type="flex" style={{ padding: 20, minHeight: 50 }}>
                        <Col span={6}>
                            <div style={{ padding: "0px 12px", display: "flex", justifyContent: "space-between" }}>
                                <Dropdown overlay={this.renderMenu}>
                                    <Button>
                                        Add <Icon type="down" />
                                    </Button>
                                </Dropdown>
                                <Button type="danger" icon="delete"></Button>
                            </div>
                        </Col>
                        <Col span={18}>
                            content header
                       </Col>
                    </Row>
                    <Row style={{ minHeight: 700, padding: 20 }}>
                        <Col span={6}>
                            <ConnectedBuilderSidebar
                                formId={this.props.form}
                                onSelect={(e) => {
                                    this.setState({
                                        selectedNode: e[0]
                                    })
                                }} />
                            <Divider type="vertical" />
                        </Col>

                        <Col span={18}>
                            <div style={{ marginLeft: 20 }}>

                                {this.renderEditor()}
                            </div>

                        </Col>
                    </Row>

                </Row>
                <Footer>
                    Stats
                </Footer>
            </Card >

        )
    }

}