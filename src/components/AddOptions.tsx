import React from "react";
import { Table } from "reactstrap";
import { Button, Divider, ButtonGroup } from "@blueprintjs/core";
import { QACondition } from "../form/condition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { getRandomId } from "../utils/getRandomId";
import { AnswerType } from "../form/answer";
import Creatable from 'react-select/creatable';
import { AnswerTypeInput, QAValueType } from "./AnswerType";
import _ from "lodash";
import { ValInput } from "./ValInput";
import { customStyles } from "./DPFormItem";
import Select from "react-select";
interface QAAddOptionsState {
    options: AnswerOptions,

}
interface QAAddOptionsProps {
    options: AnswerOptions,
    defaultOptionType: QAValueType

}
export class QAAddOptions extends React.Component<QAAddOptionsProps, QAAddOptionsState>{
    constructor(props: QAAddOptionsProps) {
        super(props);
        this.state = {
            options: this.props.options || []
        }
    }
    handleAddNewOption() {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.addOption();
            return {
                options: cloned
            }
        })
    }
    handleGroupNameChange(oldname: string, newname: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.changeGroupName(oldname, newname);
            return {
                options: cloned
            }
        })
    }
    handleOptionTypeChange(id: string, newType: QAValueType) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.setOptionTypeFor(id, newType);
            return {
                options: cloned
            }
        })
    }

    handleGroupAssignment(ids: string[], groupname: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.assignOptionToGroup(ids, groupname)
            return {
                options: cloned
            }
        });
    }

    handleGroupUnassignment(ids: string[]) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.unassignGroup(ids)
            return {
                options: cloned
            }
        });
    }

    handleOptionDelete(id: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.deleteOption(id);
            return {
                options: cloned
            }
        });
    }
    render() {
        return (
            <>
                <ButtonGroup fill={true} vertical={true}>
                    <QAOptionSection groups={Object.values(this.state.options.optionGroupMap)}
                        handleGroupAssignment={this.handleGroupAssignment.bind(this)}
                        handleOptionTypeChange={this.handleOptionTypeChange.bind(this)}
                        handleAddNewOption={this.handleAddNewOption.bind(this)}
                        handleOptionDelete={this.handleOptionDelete.bind(this)}
                        options={Object.values(this.state.options.optionsMap)}></QAOptionSection>
                    <Divider />
                    <QAAddGroupSection
                        handleGroupUnassignment={this.handleGroupUnassignment.bind(this)}
                        handleGroupAssignment={this.handleGroupAssignment.bind(this)}
                        handleGroupNameChange={this.handleGroupNameChange.bind(this)}
                        options={Object.values(this.state.options.optionsMap)}
                        groups={Object.values(this.state.options.optionGroupMap)} />

                </ButtonGroup>
            </>
        )
    }
}

interface QAAoptionSectionProps {
    options: Option[],
    groups: OptionGroup[],
    handleAddNewOption?: () => void,
    handleOptionTypeChange?: (id: string, newType: QAValueType) => void
    handleGroupAssignment?: (ids: string[], groupname: string) => void,
    handleOptionDelete?: (id: string) => void,
}
interface QAAddOptionsSectionState {
    options: Option[]
}

export class QAOptionSection extends React.Component<QAAoptionSectionProps, QAAddOptionsSectionState>{
    defaultProps = {
        options: [],
        groups: []
    }
    constructor(props: QAAoptionSectionProps) {
        super(props);
        this.state = {
            options: this.props.options
        }
    }

    generateAddGroupInput(option: Option) {
        let creatableOptions = this.props.groups.map(item => ({ value: item.name, label: item.name }));
        let value = creatableOptions.find(item => item.value === option.groupName);
        return <Creatable value={value || null} styles={customStyles} options={creatableOptions} onChange={(e: any) => {
            if (this.props.handleGroupAssignment) this.props.handleGroupAssignment([option.id], e.value);
        }} />
    }

    handleAddNewOption() {
        if (this.props.handleAddNewOption) this.props.handleAddNewOption();

    }

    handleConditionEdit(index: number) {

    }

    handleAddGroupInput(index: number) {

    }
    handleOptionDelete(id: string) {
        if (this.props.handleOptionDelete) this.props.handleOptionDelete(id);
    }

    handleOptionTypeChange(option_id: string, newType: QAValueType) {
        if (this.props.handleOptionTypeChange) this.props.handleOptionTypeChange(option_id, newType)
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
                            <td><AnswerTypeInput onChange={e => this.handleOptionTypeChange(item.id, e)} /></td>
                            <td>{<ValInput onChange={e => console.log(e)} defaultValue={item.value} type={item.type} />}</td>
                            <td><Button onClick={this.handleConditionEdit.bind(this, i)} style={{ color: 'red' }} icon="key" /></td>
                            <td>{this.generateAddGroupInput(item)}</td>
                            <td><Button onClick={this.handleOptionDelete.bind(this, item.id)} icon="cross" /></td>

                        </tr>
                    })}
                    <tr>
                        <td><Button icon={"add"} onClick={this.handleAddNewOption.bind(this)}></Button></td>
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
interface RangeValue {
    min: number,
    max: number,
}

interface Option {
    type?: QAValueType;
    id: string,
    value?: RangeValue | Date | number | string
    groupName?: string
}

interface OptionGroup {
    id: string,
    name: string,
    appearingCondition?: QACondition,
    members: Option[],

}

interface QAAoptionGroupSectionProps {
    groups: OptionGroup[],
    options: Option[],
    handleGroupAssignment?: (id: string[], groupname: string) => void,
    handleGroupUnassignment?: (id: string[]) => void,
    handleGroupNameChange?: (oldname: string, newname: string) => void,
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
                        console.log(this.props.groups);
                        console.log(this.props.options);
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
                            <td></td>
                            <td></td>

                        </tr>


                    })}
                </tbody>
            </Table>
        )
    }
}

export class AnswerOptions {

    optionsMap: { [key: string]: Option } = {};
    optionGroupMap: { [key: string]: OptionGroup } = {};
    options: (Option | OptionGroup)[] = []
    private opt_count: number = 0;
    private group_count: number = 0;


    constructor() {

    }


    addOption(option?: Option, groupname?: string) {
        if (!option) {
            option = { id: 'opt-' + this.opt_count, value: undefined, groupName: groupname }
        }
        this.optionsMap[option.id] = option;
        if (groupname) {
            let group: OptionGroup = this.optionGroupMap[groupname];
            if (!group) {
                group = { id: "opt-grp-" + this.group_count, name: groupname, appearingCondition: undefined, members: [option] }
                this.optionGroupMap[groupname] = group;
                this.group_count++;
            }
            this.options.push(group);

        }
        else {
            this.options.push(option);
        }
        this.opt_count++;
        return this;
    }
    addGroup(groupname: string) {
        let group: OptionGroup = { id: "opt-grp" + this.group_count, name: groupname, appearingCondition: undefined, members: [] }
        this.optionGroupMap[group.name] = group;
        this.options.push(group);
        this.group_count++;
        return group;
    }

    deleteOption(id: string) {
        let opt = this.optionsMap[id];
        if (opt) {
            delete this.optionsMap[id];
            let groupname = opt.groupName;
            if (groupname) {
                let group = this.optionGroupMap[groupname];
                if (group) {
                    let ind = group.members.findIndex(item => item.id === id);
                    if (ind > -1) {
                        console.log("deleting from group");
                        group.members.splice(ind, 1);
                    }
                }

            }

        }
        return this;

    }

    assignOptionToGroup(optionIds: string[], groupName: string) {
        let existingGroup = this.optionGroupMap[groupName];
        if (!existingGroup) {
            existingGroup = this.addGroup(groupName);
            this.optionGroupMap[existingGroup.name] = existingGroup;

        }
        for (let i = 0; i < optionIds.length; i++) {
            let optionId = optionIds[i];
            let option = this.optionsMap[optionId];
            let option_group = option.groupName && this.optionGroupMap[option.groupName];

            if (existingGroup.members.find(item => item.id === optionId)) continue;
            //unassign from the group the option is in 
            if (option_group) {
                let find = option_group.members.findIndex(item => item.id === option.id);
                if (find > -1) {
                    option_group.members.splice(find, 1);
                }
            }

            option.groupName = existingGroup.name;
            existingGroup.members.push(option);

        }
        return this;

    }
    unassignGroup(ids: string[]) {
        ids.forEach(id => {
            let option = this.optionsMap[id];
            let opt_groupname = option.groupName
            if (option && opt_groupname) {
                let optgroup = this.optionGroupMap[opt_groupname];
                if (optgroup) {
                    let ind = optgroup.members.findIndex(item => item.id === id);
                    optgroup.members.splice(ind, 1);
                }

            }
            if (option) {
                option.groupName = undefined;
            }
        })
    }
    changeGroupName(oldname: string, newname: string) {
        let group = this.optionGroupMap[oldname];
        let members_ids = group.members.map(item => item.id);
        if (members_ids) {
            members_ids.forEach(id => {
                let option = this.optionsMap[id];
                if (option) option.groupName = newname;
            })
        }
        if (group) {
            group.name = newname;
            let newGroup = _.clone(group);
            delete this.optionGroupMap[oldname];
            this.optionGroupMap[newname] = newGroup;
        }
    }

    setOptionTypeFor(optionId: string, newType: QAValueType) {
        let opt = this.optionsMap[optionId];
        if (opt) {
            opt.type = newType;
            opt.value = undefined;
        }
        console.log(this.optionGroupMap);
    }

}