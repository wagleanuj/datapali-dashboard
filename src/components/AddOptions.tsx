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
    handleOptionTypeChange(id: string, newType: QAValueType) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.setOptionTypeFor(id, newType);
            return {
                options: cloned
            }
        })
    }
    handleGroupAssignment(id: string, groupname: string) {
        this.setState((prevState: QAAddOptionsState) => {
            let cloned = _.clone(prevState.options);
            cloned.assignOptionToGroup(id, groupname)
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
                    <QAAddGroupSection options={Object.values(this.state.options.optionsMap)}
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
    handleGroupAssignment?: (id: string, groupname: string) => void,
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

    generateAddGroupInput(id: string) {
        let creatableOptions = this.props.groups.map(item => ({ value: item.name, label: item.name }));
        return <Creatable styles={customStyles} options={creatableOptions} onChange={(e: any) => {
            if (this.props.handleGroupAssignment) this.props.handleGroupAssignment(id, e.value);
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
                            <td>{item.id.substr(0, 5)}</td>
                            <td><AnswerTypeInput onChange={e => this.handleOptionTypeChange(item.id, e)} /></td>
                            <td>{<ValInput onChange={e => console.log(e)} defaultValue={item.value} type={item.type} />}</td>
                            <td><Button onClick={this.handleConditionEdit.bind(this, i)} style={{ color: 'red' }} icon="key" /></td>
                            <td>{this.generateAddGroupInput(item.id)}</td>
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
    name: string,
    appearingCondition?: QACondition,
    members: Option[],

}

interface QAAoptionGroupSectionProps {
    groups: OptionGroup[],
    options: Option[],
    handleGroupAssignment?: (id: string, groupname: string) => void,

}
interface QAAddOptionSectionState {

}
export class QAAddGroupSection extends React.Component<QAAoptionGroupSectionProps, QAAddOptionSectionState>{
    constructor(props: QAAoptionGroupSectionProps) {
        super(props);
        this.state = {

        }
    }
    handleGroupAssignment(e:any){
        console.log(e);
        // if(this.props.handleGroupAssignment) this.props.handleGroupAssignment(id, groupname)
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
                    {this.props.groups.map(item => {
                        let options = this.props.options.map(item => ({ value: item.id, label: item.id }));
                        let memberids = item.members.map(item => item.id);
                        let selected = options.filter(item => memberids.includes(item.value))
                        return <tr key={item.name}>
                            <td></td>
                            <td>{item.name}</td>
                            <td><Select onChange={(e:any)=>this.handleGroupAssignment(e)} defaultValue={selected} isMulti={true} options={options} /></td>
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

    constructor() {

    }


    addOption(option?: Option, groupname?: string) {
        if (!option) {
            option = { id: getRandomId("opt-"), value: undefined, groupName: groupname }
        }
        this.optionsMap[option.id] = option;
        if (groupname) {
            let group: OptionGroup = this.optionGroupMap[groupname];
            if (!group) {
                group = { name: groupname, appearingCondition: undefined, members: [option] }
                this.optionGroupMap[groupname] = group;
            }
            this.options.push(group);

        }
        else {
            this.options.push(option);
        }
        return this;
    }
    addGroup(groupname: string) {
        let group: OptionGroup = { name: groupname, appearingCondition: undefined, members: [] }
        this.optionGroupMap[group.name] = group;
        this.options.push(group);
        return this;
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

    assignOptionToGroup(optionId: string, groupName: string) {
        let existingGroup = this.optionGroupMap[groupName];
        let option = this.optionsMap[optionId];
        let option_group = option.groupName && this.optionGroupMap[option.groupName];

        if (existingGroup) {
            if (existingGroup.members.find(item => item.id === optionId)) return this;
        }

        //unassign from the group the option is in 
        if (option_group) {
            let find = option_group.members.findIndex(item => item.id === option.id);
            if (find > -1) {
                option_group.members.splice(find, 1);
            }
        }
        if (!existingGroup) {
            existingGroup = { name: groupName, appearingCondition: undefined, members: [option] }
            this.optionGroupMap[existingGroup.name] = existingGroup;
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