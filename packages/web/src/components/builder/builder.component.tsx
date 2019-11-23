import { getRandomId } from "@datapali/dpform";
import { Button, Card, Col, Divider, Dropdown, Icon, Layout, Menu, Row, Tree } from "antd";
import React from "react";
import { IRootForm } from "../../types";
import { IQuestion, ISection } from "../formfiller/types";
import SidebarTree from "./sidebartree.builder.component";
import {Map, List} from "immutable-js";
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
    handleAddItemInForm?: (formId: string, item: IQuestion | ISection, parentId: string) => void;
    formId?: string;
}
type BuilderState = {
    selectedNode: string;
    tree: IRootForm;
    rootId: string;
    currentSectionId: string;
}

export class Builder extends React.Component<BuilderProps, BuilderState>{
    state = {
        selectedNode: null,
        tree: {
            [defaultTree.id]: defaultTree
        },
        rootId: defaultTree.id,
        currentSectionId: defaultTree.id,
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
            if (this.props.handleAddItemInForm) this.props.handleAddItemInForm(this.props.formId, newSection, this.state.currentSectionId)
        } else if (key === "add-question") {
            const newQuestion: IQuestion = {
                _type: "question",
                answerType: { name: undefined },
                questionContent: undefined,
                id: getRandomId("root-"),
                isRequired: false,
                creationDate: 0,
                customId: undefined,
                options: undefined,
            };

        }
    }

    renderMenu = (
        <Menu onClick={this.handleActionMenuItemClick}>
            <Menu.Item key="add-section">Section</Menu.Item>
            <Menu.Item key="add-question">Question</Menu.Item>
        </Menu>

    )

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
                            <SidebarTree tree={this.state.tree} rootId={this.state.rootId} onSelect={() => { console.log("clicked") }} />
                            <Divider type="vertical" />
                        </Col>

                        <Col span={18}>
                            content
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