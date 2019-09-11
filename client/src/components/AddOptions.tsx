import { AnswerOptions,Constants, QAQuestion, IValueType, ILiteral, QACondition, IOption, IOptionGroup, IConstant } from "dpform";
import React from "react";
import _ from "lodash";
import { CreateConditionModal } from "./CreateConditionModal";
import {  Table } from "reactstrap";
import { H5, Divider , Button, ButtonGroup} from "@blueprintjs/core";
import Select from "react-select/";
import { customStyles } from "./DPFormItem";
import { AnswerTypeInput } from "./AnswerType";
import { ValInput } from "./ValInput";
import Creatable from "react-select/creatable"
import {openModal, destroyModal} from "../utils"

interface QAAddOptionsState {
    options: AnswerOptions,
}
interface QAAddOptionsProps {
    constants: Constants,
    definedQuestions: { [key: string]: QAQuestion }
    options: AnswerOptions,
    defaultOptionType: IValueType,
    onChange: (options: AnswerOptions) => void,
}
enum OPTION_OR_GROUP {
    OPTION = 1,
    GROUP = 2
}
export class QAAddOptions extends React.Component<QAAddOptionsProps, QAAddOptionsState>{
    constructor(props: QAAddOptionsProps) {
        super(props);
        this.state = {
            options: this.props.options || []
        }
    }
    handleChange() {
        if (this.props.onChange) this.props.onChange(this.state.options);
    }
    handleAddNewOption() {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.addOption();
            return {
                options: cloned
            }
        }, this.handleChange.bind(this))
    }
    handleGroupNameChange(oldname: string, newname: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.changeGroupName(oldname, newname);
            return {
                options: cloned
            }
        }, this.handleChange.bind(this))
    }
    handleGroupDelete(name: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.deleteGroup(name);
            return {
                options: cloned
            }
        }, this.handleChange.bind(this))
    }
    handleOptionTypeChange(id: string, newType: IValueType) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.setOptionTypeFor(id, newType);
            return {
                options: cloned
            }
        }, this.handleChange.bind(this))
    }

    handleGroupAssignment(ids: string[], groupname: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.assignOptionToGroup(ids, groupname)
            return {
                options: cloned
            }
        }, this.handleChange.bind(this));
    }

    handleGroupUnassignment(ids: string[]) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.unassignGroup(ids)
            return {
                options: cloned
            }
        }, this.handleChange.bind(this));
    }

    handleOptionDelete(id: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.deleteOption(id);
            return {
                options: cloned
            }
        }, this.handleChange.bind(this));
    }
    handleOptionValueChange(id: string, newValue: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.setValueForOption(id, newValue);
            return {
                options: cloned
            }
        }, this.handleChange.bind(this));
    }
    handleAddGroup() {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.addGroup();
            return {
                options: cloned
            }
        }, this.handleChange.bind(this));
    }
    handleConditionClick(type: OPTION_OR_GROUP, name: string) {
        // openModal()
        let condition;
        if (type === OPTION_OR_GROUP.GROUP) {
            condition = this.state.options.optionGroupMap[name].appearingCondition;
        }
        else {
            condition = this.state.options.optionsMap[name].appearingCondition;
        }
        let el = <CreateConditionModal
            definedQuestions={this.props.definedQuestions}
            isOpen={true}
            onSubmit={this.setCondition.bind(this, name, type)}
            onCancel={destroyModal.bind(this)}
            condition={condition} />
        openModal(el);
    }

    setCondition(idOrname: string, type: OPTION_OR_GROUP, literals: ILiteral[]) {

        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            if (type === OPTION_OR_GROUP.GROUP) {

                let group = cloned.optionGroupMap[idOrname];
                if (!group.appearingCondition) {
                    group.appearingCondition = new QACondition()
                }
                group.appearingCondition.setLiterals(literals)
            }
            else if (type === OPTION_OR_GROUP.OPTION) {
                let option = cloned.optionsMap[idOrname];
                if (!option.appearingCondition) option.appearingCondition = new QACondition();
                option.appearingCondition.setLiterals(literals)
            }
            return {
                options: cloned
            }
        }, () => {
            destroyModal();
            this.handleChange();
        });

    }
    handleImportFromConstant(a: any) {
        let constant = this.props.constants.getConstant(a.value);
        console.log(a);
        console.log(constant);
        if (constant && constant.value instanceof AnswerOptions) {
            this.setState({
                options: constant.value
            },this.handleChange.bind(this))
        }
    }

    render() {
        let constantsOptions = this.props.constants.ConstantsArray.map((item:IConstant) => ({ label: item.name, value: item.name }));
        return (
            <ButtonGroup fill={true} vertical={true}>
                <H5>Import From Constant </H5>
                <Select styles={customStyles} options={constantsOptions} onChange={this.handleImportFromConstant.bind(this)}></Select>
                <QAOptionSection
                    groups={this.state.options.optionGroupMap ? Object.values(this.state.options.optionGroupMap) : []}
                    handleGroupAssignment={this.handleGroupAssignment.bind(this)}
                    handleOptionTypeChange={this.handleOptionTypeChange.bind(this)}
                    handleAddNewOption={this.handleAddNewOption.bind(this)}
                    handleOptionDelete={this.handleOptionDelete.bind(this)}
                    handleConditionClick={this.handleConditionClick.bind(this, OPTION_OR_GROUP.OPTION)}
                    handleOptionValueChange={this.handleOptionValueChange.bind(this)}
                    options={this.state.options.optionsMap ? Object.values(this.state.options.optionsMap) : []}
                />

                <Divider />
                <QAAddGroupSection
                    handleAddGroup={this.handleAddGroup.bind(this)}
                    handleGroupUnassignment={this.handleGroupUnassignment.bind(this)}
                    handleGroupAssignment={this.handleGroupAssignment.bind(this)}
                    handleGroupNameChange={this.handleGroupNameChange.bind(this)}
                    handleGroupDelete={this.handleGroupDelete.bind(this)}
                    handleGroupConditionClick={this.handleConditionClick.bind(this, OPTION_OR_GROUP.GROUP)}
                    options={this.state.options.optionsMap ? Object.values(this.state.options.optionsMap) : []}
                    groups={this.state.options.optionGroupMap ? Object.values(this.state.options.optionGroupMap) : []}
                />

            </ButtonGroup>
        )
    }
}

interface QAAoptionSectionProps {
    options: IOption[],
    groups: IOptionGroup[],
    handleAddNewOption?: () => void,
    handleOptionTypeChange?: (id: string, newType: IValueType) => void
    handleGroupAssignment?: (ids: string[], groupname: string) => void,
    handleOptionDelete?: (id: string) => void,
    handleConditionClick?: (id: string) => void,
    handleOptionValueChange?: (id: string, newVal: string) => void,
}
interface QAAddOptionsSectionState {
    options: IOption[]
}

export class QAOptionSection extends React.Component<QAAoptionSectionProps, QAAddOptionsSectionState>{
    static defaultProps = {
        options: [],
        groups: []
    }
    constructor(props: QAAoptionSectionProps) {
        super(props);
        this.state = {
            options: this.props.options
        }
    }
    shouldComponentUpdate(nextProps: QAAoptionSectionProps, nextState:QAAddOptionsSectionState ){
        if(nextProps.options.length!==this.props.options.length || nextProps.groups.length!==this.props.groups.length){
            return true;
        }
        return false;
    }

    generateAddGroupInput(option: IOption) {
        let creatableOptions = this.props.groups.map(item => ({ value: item.name, label: item.name }));
        let value = creatableOptions.find(item => item.value === option.groupName);
        return <Creatable value={value || null} styles={customStyles} options={creatableOptions} onChange={(e: any) => {
            if (this.props.handleGroupAssignment) this.props.handleGroupAssignment([option.id], e.value);
        }} />
    }

    handleAddNewOption() {
        if (this.props.handleAddNewOption) this.props.handleAddNewOption();

    }

    handleConditionEdit(id: string) {
        if (this.props.handleConditionClick) this.props.handleConditionClick(id)
    }

    handleAddGroupInput(index: number) {

    }
    handleOptionDelete(id: string) {
        if (this.props.handleOptionDelete) this.props.handleOptionDelete(id);
    }

    handleOptionTypeChange(option_id: string, newType: IValueType) {
        if (this.props.handleOptionTypeChange) this.props.handleOptionTypeChange(option_id, newType)
    }
    handleOptionValueChange(id: string, newValue: any) {
        if (this.props.handleOptionValueChange) this.props.handleOptionValueChange(id, newValue.value);
    }

    render() {
        return (
            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Id</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Condition</th>
                        <th>Group</th>
                        <th></th>

                    </tr>
                </thead>
                <tbody>
                    {this.props.options.map((item, i) => {
                        return <tr key={item.id}>
                            <td></td>
                            <td>{item.id}</td>
                            <td><AnswerTypeInput answerType={item.type} onChange={e => this.handleOptionTypeChange(item.id, e)} /></td>
                            <td><ValInput onChange={this.handleOptionValueChange.bind(this, item.id)} defaultValue={item.value} type={item.type} /></td>
                            <td><Button onClick={this.handleConditionEdit.bind(this, item.id)} style={{ color: 'red', width: 20 }} icon="key" /></td>
                            <td>{this.generateAddGroupInput(item)}</td>
                            <td><Button style={{ width: 20 }} onClick={this.handleOptionDelete.bind(this, item.id)} icon="cross" /></td>

                        </tr>
                    })}
                    <tr>
                        <td><Button style={{ width: 20 }} icon={"add"} onClick={this.handleAddNewOption.bind(this)}></Button></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}



interface QAAoptionGroupSectionProps {
    groups: IOptionGroup[],
    options: IOption[],
    handleGroupAssignment?: (id: string[], groupname: string) => void,
    handleGroupUnassignment?: (id: string[]) => void,
    handleGroupNameChange?: (oldname: string, newname: string) => void,
    handleGroupDelete?: (name: string) => void,
    handleGroupConditionClick?: (name: string) => void,
    handleAddGroup?: () => void,

}
interface QAAddOptionSectionState {

}
export class QAAddGroupSection extends React.Component<QAAoptionGroupSectionProps, QAAddOptionSectionState>{
    constructor(props: QAAoptionGroupSectionProps) {
        super(props);
        this.state = {

        }
    }
    handleGroupAssignment(e: { value: string, label: string }[], groupname: string) {
        if (e) {
            let ids = e.map(item => item.value)
            console.log(ids);
            if (this.props.handleGroupAssignment) this.props.handleGroupAssignment(ids, groupname)
        }

    }

    render() {
        return (

            <Table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Group Name</th>
                        <th>Group Items</th>
                        <th>Appearing Condition</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.groups.map((item, index) => {
                        let options = this.props.options.map(item => ({ value: item.id, label: item.id }));
                        let memberids = item.members.map(item => item.id);
                        let selected = options.filter(item => memberids.includes(item.value))
                        return <tr key={item.id}>
                            <td></td>
                            <td><input key={item.id} type="text" className="form-control" defaultValue={item.name} onChange={e => {
                                if (this.props.handleGroupNameChange) this.props.handleGroupNameChange(item.name, e.target.value);
                            }} /></td>
                            <td><Select styles={customStyles}
                                onChange={(e: any, action: any) => {
                                    if (action.action === "remove-value") {
                                        let removedid = action.removedValue.value;
                                        if (this.props.handleGroupUnassignment) this.props.handleGroupUnassignment([removedid])
                                    }
                                    this.handleGroupAssignment(e, item.name)
                                }}
                                value={selected}

                                isMulti={true} options={options} /></td>
                            <td><Button style={{ width: 20 }} icon="key" onClick={() => {
                                if (this.props.handleGroupConditionClick) this.props.handleGroupConditionClick(item.name)
                            }} /></td>
                            <td><Button style={{ width: 20 }} icon="cross" onClick={() => {
                                if (this.props.handleGroupDelete) this.props.handleGroupDelete(item.name)
                            }} /></td>

                        </tr>



                    })}
                    <tr>
                        <td><Button style={{ width: 20 }} icon="add" onClick={() => {
                            if (this.props.handleAddGroup) this.props.handleAddGroup()
                        }} /></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                    </tr>
                </tbody>
            </Table>
        )
    }
}

