import { Card, Icon, Tree, Typography } from 'antd';
import { AntTreeNodeSelectedEvent } from 'antd/lib/tree';
import classNames from 'classnames';
import React, { Component } from 'react';
import { IRootForm } from '../../types';
const { TreeNode } = Tree;
type SidebarTreeProps = {
    tree: IRootForm;
    rootId: string;
    onSelect: (selectedKeys: string[], e: AntTreeNodeSelectedEvent) => void;
}
type SidebarTreeState = {

}
export default class SidebarTree extends Component<SidebarTreeProps, SidebarTreeState> {
    renderTreeNode = (node: any) => {
        if (node._type === "question") {
            //leaf node
            return (
                <TreeNode className={classNames("tree-question-node", "c-tree-node")} icon={<Icon type="form" />} title={<Typography.Text ellipsis>{node.questionContent.content}</Typography.Text>} key={node.id} />
            )
        } else if (node.childNodes) {
            return <TreeNode className={"c-tree-node"} title={<Typography.Text ellipsis>{node.name}</Typography.Text>} key={node.id}>
                {node.childNodes.map((n: string) => this.renderTreeNode(this.props.tree[n]))}
            </TreeNode>
        }
    }
    render() {
        const { tree, rootId } = this.props;
        return (
            <Card>

                <Tree

                    showLine
                    switcherIcon={<Icon type="down" />}
                    defaultExpandAll
                    onSelect={this.props.onSelect}

                >
                    {this.renderTreeNode(tree[rootId])}
                </Tree>
            </Card>

        )
    }
}
