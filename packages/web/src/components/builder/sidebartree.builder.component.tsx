import { Card, Icon, Tree, Typography } from 'antd';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';
import classNames from 'classnames';
import React, { Component } from 'react';
import { IRootForm } from '../../types';
const { TreeNode } = Tree;
type SidebarTreeProps = {
    tree?: IRootForm;
    formId: string;
    onSelect: (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => void;
}
type SidebarTreeState = {

}
export default class SidebarTree extends Component<SidebarTreeProps, SidebarTreeState> {
    renderTreeNode = (node: any) => {
        if (node._type === "question") {
            //leaf node
            return (
                <TreeNode
                    checkable
                    className={classNames("tree-question-node", "c-tree-node")}
                    icon={() => <Icon type="form" />}
                    title={<Typography.Text ellipsis>{node.questionContent.content}</Typography.Text>}
                    key={node.id}
                />
            )
        } else if (node.childNodes) {
            return <TreeNode
                checkable
                icon={() => <Icon type="folder" />}
                className={"c-tree-node"}
                title={<Typography.Text ellipsis>{node.name}</Typography.Text>}
                key={node.id}
            >
                {node.childNodes.map((n: string) => this.renderTreeNode(this.props.tree[n]))}
            </TreeNode>
        }
    }
    render() {
        const { tree, formId } = this.props;
        if (!tree || !formId) return null;
        return (
            <Card>
                <Tree
                    showIcon
                    switcherIcon={<Icon type="down" />}
                    defaultExpandAll
                    onSelect={this.props.onSelect}
                >
                    {this.renderTreeNode(tree[formId])}
                </Tree>
            </Card>

        )
    }
}
