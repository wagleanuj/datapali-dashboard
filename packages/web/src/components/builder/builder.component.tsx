import { getRandomId } from "@datapali/dpform";
import { Button, Card, Col, Divider, Dropdown, Icon, Layout, Menu, Row, Tree } from "antd";
import React from "react";
import { IRootForm } from "../../types";
import { IQuestion, ISection } from "../formfiller/types";
import QuestionEdit from "./questionedit.builder.component";
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
    formId?: string;
    tree?: IRootForm;
}
type BuilderState = {
    selectedNode: string;
    currentSectionId: string;
}

export class Builder extends React.Component<BuilderProps, BuilderState>{
    state = {
        selectedNode: null,
        currentSectionId: this.props.formId,
    }

    onSelect = (id) => {
        console.log(id);
    }


    handleActionMenuItemClick = ({ key }) => {
        if (key === "add-section") {
            const newSection: ISection = {
                _type: "section",
                appearingCondition: undefined,
                childNodes: [],
                customId: undefined,
                id: getRandomId("section-"),
                duplicatingSettings: undefined,
                name: ""
            };

            if (this.props.handleAddItemInForm) this.props.handleAddItemInForm(this.props.formId, this.state.currentSectionId, newSection)
        } else if (key === "add-question") {
            const newQuestion: IQuestion = {
                _type: "question",
                answerType: { name: undefined },
                questionContent: {
                    content: undefined,
                    type: undefined,
                },
                id: getRandomId("question-"),
                isRequired: false,
                creationDate: 0,
                customId: undefined,
                options: undefined,
            };
            if (this.props.handleAddItemInForm) this.props.handleAddItemInForm(this.props.formId, this.state.currentSectionId, newQuestion)

        }
    }

    renderMenu = (
        <Menu onClick={this.handleActionMenuItemClick}>
            <Menu.Item key="add-section">Section</Menu.Item>
            <Menu.Item key="add-question">Question</Menu.Item>
        </Menu>
    );

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
                                formId={this.props.formId}
                                onSelect={() => { console.log("clicked") }} />
                            <Divider type="vertical" />
                        </Col>

                        <Col span={18}>
                            <QuestionEdit />
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