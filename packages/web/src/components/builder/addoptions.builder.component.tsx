import { ANSWER_TYPES, ILiteral, IValueType, QAComparisonOperator } from '@datapali/dpform';
import { Button, Card, Drawer, Icon, Select, Table, Tooltip, Tree, TreeSelect, Typography } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { getFormValues } from 'redux-form';
import { IAppState, IRootForm } from '../../types';
import { QUESTION } from '../formfiller/types';
type AddOptionsProps = {
    optionTree?: any;
    form: string;
    questionId: string;
}
export default class AddOptions extends Component<AddOptionsProps, any> {
    state = {
        selectedNodes: [],
        drawerVisible: false,

    }
    static defaultProps = {
        optionTree: {
            ids: ["1", "2"],
            byId: {
                "1": {
                    title: "option 1",
                    id: "1",
                    appearingCondition: [],
                },
                "2": {
                    title: "option2",
                    id: 2,
                    appearingCondition: [],
                    options: ["3", "4"]
                },
                "3": {
                    title: "option 2-1",
                    id: "3"
                },
                "4": {
                    title: "option 2-2",
                    id: "4",
                }

            }
        }
    }
    renderOptions(node: any) {
        if (!node) return null;
        const className = node.options && node.options.length > 0 ? "dp-option" : "dp-opt-group";
        const children = node.options ? node.options.map(item => this.renderOptions(this.props.optionTree.byId[item])) : null;
        return (
            <Tree.TreeNode
                key={node.id}
                checkable

                className={className}
                isLeaf={!!!children}
                title={<span >
                    {node.title}
                </span>}
            >
                {children}
            </Tree.TreeNode>
        )
    }
    onSelect = (item) => {
        console.log(item);
    }

    render() {
        console.log(this.props);
        const hasMoreThanOneSelection = this.state.selectedNodes.length > 1;
        const hasNoSelection = this.state.selectedNodes.length === 0;
        return (
            <Card>
                <div style={{
                    background: '#001529',
                    height: 50,
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 10,
                    color: "white"
                }}>
                    <div className="selection-text">
                        {this.state.selectedNodes.length > 0 && (
                            <Typography.Text style={{ color: 'white' }} >{this.state.selectedNodes.length + " selected"}</Typography.Text>
                        )}
                    </div>

                    <ButtonGroup>

                        {!hasMoreThanOneSelection && <Tooltip title={"Add Option/Group"}>
                            <Button type="primary" icon="plus" />
                        </Tooltip>}

                        {!hasNoSelection && <Tooltip title={"Add Appearing Condition"}>
                            <Button type="primary" icon="key" onClick={() => this.setState({ drawerVisible: true })} />
                        </Tooltip>}

                        {!hasNoSelection && <Tooltip title={"Delete Selected option" + (this.state.selectedNodes.length > 1 ? "s" : "")}>
                            <Button type="danger" icon="close" />
                        </Tooltip>
                        }
                    </ButtonGroup>

                </div>
                <Card>


                    <Tree
                        onCheck={(checkedKeys) => this.setState({ selectedNodes: checkedKeys })}
                        selectedKeys={this.state.selectedNodes}
                        draggable
                        showIcon
                        selectable={false}
                        checkable
                        switcherIcon={<Icon type="down" />}
                        defaultExpandAll
                        onSelect={this.onSelect}
                    >
                        {this.props.optionTree && this.props.optionTree.ids && this.props.optionTree.ids.map(item => this.renderOptions(this.props.optionTree.byId[item]))}
                    </Tree>
                    <ConditionEditDrawer
                        editingQuestionId={this.props.questionId}
                        form={this.props.form}
                        visible={this.state.drawerVisible}
                        literals={[]}
                        onClose={() => this.setState({ drawerVisible: false })}
                        onSubmit={lits => console.log(lits)}
                    />

                </Card>

            </Card >
        )
    }
}
function getOperatorForType(valueType?: IValueType) {
    let allOperators = Object.values(QAComparisonOperator);
    let type = valueType && valueType.name;

    switch (type) {
        case ANSWER_TYPES.BOOLEAN:
        case ANSWER_TYPES.DATE:
        case ANSWER_TYPES.STRING:
        case ANSWER_TYPES.TIME:


            return allOperators.filter(item => item === QAComparisonOperator.Equal);
        case ANSWER_TYPES.NUMBER:
        default:
            return allOperators;
    }
}
const makeColumns = (root: IRootForm, rootId: string, cutOffId: string, onChange: (index, updatedLiteral) => void) => [
    {
        title: 'Question',
        dataIndex: 'questionRef',
        render: (text, record, index) => <TreeSelect
            style={{ width: '100%' }}
            value={record.questionRef}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Select a question"
            treeDefaultExpandAll
            onChange={(selectedOnes) => {
                const newRecord = { ...record };
                newRecord.questionRef = selectedOnes;
                onChange(index, newRecord)
            }}
        >
            {makeTree(root, root[rootId], cutOffId)}
        </TreeSelect>,
    },
    {
        title: 'Comparison Op',
        className: 'comparison-op',
        dataIndex: 'comparisonOperator',
        render: (text, record, index) => {
            const ref = root[record.questionRef];
            const valueType = ref && ref._type === QUESTION && ref.answerType;
            return (
                <Select
                    value={text}
                    onChange={(sel) => {
                        const newRecord = { ...record };
                        newRecord.comparisonOperator = sel;
                        onChange(index, newRecord)
                    }} style={{ width: "100%" }}
                >
                    {getOperatorForType(valueType).map(item => <Select.Option value={item} >{item}</Select.Option>)}
                </Select>
            )
        }
    },
    {
        title: 'Comparison Value',
        dataIndex: 'comparisonValue',

    },
    {
        title: 'Following Op',
        dataIndex: 'followingOperator',
        render: (text, record, index) => {
            const ref = root[record.questionRef];
            const valueType = ref && ref._type === QUESTION && ref.answerType;
            return (
                <Select
                    value={text}
                    onChange={(sel) => {
                        const newRecord = { ...record };
                        newRecord.comparisonOperator = sel;
                        onChange(index, newRecord)
                    }} style={{ width: "100%" }}
                >
                    <Select.Option value={"&&"}>AND</Select.Option>
                    <Select.Option value={"||"}>OR</Select.Option>

                </Select>
            )
        }
    },
];


const makeTree = (rootForm, node, cutOffId, disable = false) => {
    const children = node.childNodes ? node.childNodes.map(n => makeTree(rootForm, rootForm[n], cutOffId, disable)) : null;
    if (node.id === cutOffId) {
        disable = true;
    }
    if (node._type === "root") {
        return children;
    }
    const isSelf = node.id === cutOffId;
    const disabledTitle = isSelf ? "cannot select the question you are editing" :
        disable ?
            "cannot select question that appears after the current question"
            : (!!children
                ? "Cannot select a section"
                : "")
    const title = node.name || (node.questionContent ? node.questionContent.content : "");
    return (
        <TreeSelect.TreeNode
            isLeaf={!!!children}
            disabled={!!children || (disable || isSelf)}
            selectable={!!!children && !disable && !isSelf}
            value={node.id}
            title={
                <Tooltip title={disabledTitle}>
                    <span>{title}</span>
                </Tooltip>
            }

            key={node.id}>
            {children}
        </TreeSelect.TreeNode>
    )
}
type CEditDrawerProps = {
    editingQuestionId: string;
    form: string;
    literals: ILiteral[];
    visible: boolean;
    onClose: () => void;
    onSubmit: (lits: ILiteral[]) => void;
}
const ConditionEditDrawer = (props: CEditDrawerProps) => {
    const root = useSelector<IAppState, IRootForm>(state => {
        return getFormValues(props.form)(state)
    });
    const currNode = root[props.editingQuestionId];
    const title = props.literals && props.literals.length > 0 ? "Edit Title" : "Add Condition";
    const [lits, setLits] = useState(props.literals || []);
    const treeNodes = makeTree(root, root[props.form], props.editingQuestionId);
    const [selectedRows, setSelectedRows] = useState([])
    const updateLiteral = (index, newLiteral) => {
        const newLits = [...lits];
        newLits[index] = newLiteral;
        setLits(newLits);
        console.log(newLits);

    }
    return (
        <Drawer
            destroyOnClose
            closable
            title={title}
            width={"75%"}
            visible={props.visible}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Table
                rowSelection={{
                    selectedRowKeys: selectedRows,
                    onChange: (rows) => { setSelectedRows(rows) }
                }}

                columns={makeColumns(root, props.form, props.editingQuestionId, updateLiteral)}
                dataSource={lits}
                bordered
                rowKey={(row) => row.literalId}
                title={() => {
                    return (
                        <div style={{ display: "flex", justifyContent: "flex-start" }}>

                            <Button style={{ marginRight: 8 }} type={'default'} onClick={() => {
                                const newLits: ILiteral[] = [...lits, {
                                    questionRef: "",
                                    comparisonOperator: undefined,
                                    comparisonValue: undefined,
                                    followingOperator: undefined,
                                    literalId: "l" + lits.length

                                }]
                                setLits(newLits)
                            }}>Add</Button>
                            <Button
                                icon="delete"
                                style={{ marginRight: 8 }}
                                type={'danger'}
                                onClick={() => {
                                    setLits(lits.filter(item => !selectedRows.includes(item.literalId)));
                                    setSelectedRows([]);
                                }}
                            >

                            </Button>


                        </div>
                    )
                }}
                footer={() => {
                    return (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button style={{ marginRight: 8 }} type={'default'} onClick={() => setLits(props.literals)}>Reset</Button>
                            <Button style={{ marginRight: 8 }} type={'default'} onClick={() => setLits([])}>Clear</Button>
                            <Button style={{ marginRight: 8 }} type={'danger'} onClick={props.onClose}>Cancel</Button>
                            <Button type={'primary'} onClick={() => props.onSubmit(lits)}>Submit</Button>
                        </div>

                    )
                }}
            />


        </Drawer>
    )
}

ConditionEditDrawer.show = function (props: CEditDrawerProps) {
    const body = document.body;
    let drawerEl = body.querySelector("#drawers")
    if (!drawerEl) {
        drawerEl = document.createElement("div");
        drawerEl.setAttribute("id", "drawers")
        body.appendChild(drawerEl)
    };
    ReactDOM.render(<ConditionEditDrawer {...props} />, drawerEl)
}
