import _ from 'lodash';
import { QACondition } from './condition';
import { answerTypeToJSON, answerTypeFromJSON, IValueType } from './valueType';

export interface IOption {
    appearingCondition?: QACondition;
    type?: IValueType;
    id: string;
    value?: string;
    groupName?: string;
}

export interface IOptionGroup {
    id: string;
    name: string;
    appearingCondition?: QACondition;
    members: IOption[];
}

export class AnswerOptions {
    optionsMap: {
        [key: string]: IOption;
    } = {};
    optionGroupMap: {
        [key: string]: IOptionGroup;
    } = {};
    options: (IOption | IOptionGroup)[] = [];
    private opt_count: number = 0;
    private group_count: number = 0;

    static toJSON(a: AnswerOptions) {
        return {
            optionsMap: a && a.optionsMap ? _.mapValues(a.optionsMap, (v => optionToJSON(v))) : {},
            optionGroupMap: a && a.optionGroupMap ? _.mapValues(a.optionGroupMap, (v) => optionGroupToJSON(v)) : {},
        };
    }

    static fromJSON(d: any): AnswerOptions {
        const r = new AnswerOptions();
        r.optionsMap = d.optionsMap ? _.mapValues(d.optionsMap, (v) => optionFromJSON(v)) : {};
        r.optionGroupMap = d.optionGroupMap ? _.mapValues(d.optionGroupMap, v => {
            const rr: IOptionGroup = {
                id: v.id,
                name: v.name,
                appearingCondition: QACondition.fromJSON(v.appearingCondition),
                members: v.members.map((item: any) => r.optionsMap[item.id]),
            };
            return rr;
        }) : {};
        return r;
    }
    get SortedOptions() {
        const grouplessOptions = Object.values(this.optionsMap).filter(item => !item.groupName);
        const groups = Object.values(this.optionGroupMap);
        return {
            groups: groups,
            rootOptions: grouplessOptions,
        };
    }
    addOption(option?: IOption) {
        if (!option) {
            option = { id: 'opt-' + this.opt_count, value: undefined, groupName: undefined };
        }
        this.optionsMap[option.id] = option;
        const groupname = option.groupName;
        if (groupname) {
            let group: IOptionGroup = this.optionGroupMap[groupname];
            if (!group) {
                group = {
                    id: 'opt-grp-' + this.group_count,
                    name: groupname,
                    appearingCondition: undefined,
                    members: [option],
                };
                this.optionGroupMap[groupname] = group;
                this.group_count++;
            }
            let optionExistInGroup = null;
            if(option && option.id){
                optionExistInGroup = group.members.find(item =>  {
                    if(option){
                       return  item.id === option.id
                    }
                    return false;
                });
            }
            if (!optionExistInGroup) { group.members.push(option); }
        }
        this.opt_count++;
        return this;
    }
    addGroup(groupname?: string) {
        const group: IOptionGroup = {
            id: 'opt-grp' + this.group_count,
            name: groupname || `group-${this.group_count}`,
            appearingCondition: undefined, members: [],
        };
        this.optionGroupMap[group.name] = group;
        this.group_count++;
        return group;
    }

    setValueForOption(id: string, newValue: string) {
        const option = this.optionsMap[id];
        if (option) {
            option.value = newValue;
        }
        return this;
    }

    deleteOption(id: string) {
        const opt = this.optionsMap[id];
        if (opt) {
            delete this.optionsMap[id];
            const groupname = opt.groupName;
            if (groupname) {
                const group = this.optionGroupMap[groupname];
                if (group) {
                    const ind = group.members.findIndex(item => item.id === id);
                    if (ind > -1) {
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
            const optionId = optionIds[i];
            const option = this.optionsMap[optionId];
            const option_group = option.groupName && this.optionGroupMap[option.groupName];
            if (existingGroup.members.find(item => item.id === optionId)) {
                continue;
            }
            // unassign from the group the option is in
            if (option_group) {
                const find = option_group.members.findIndex(item => item.id === option.id);
                if (find > -1) {
                    option_group.members.splice(find, 1);
                }
            }
            option.groupName = existingGroup.name;
            existingGroup.members.push(option);
        }
        return this;
    }
    setConditionForOption(optionId: string, condition: QACondition) {
        const option = this.optionsMap[optionId];
        if (option) {
            option.appearingCondition = condition;
        }
        return this;
    }
    setConditionForGroup(groupname: string, condition: QACondition) {
        const group = this.optionGroupMap[groupname];
        if (group) {
            group.appearingCondition = condition;
        }
        return this;
    }
    unassignGroup(ids: string[]) {
        ids.forEach(id => {
            const option = this.optionsMap[id];
            const opt_groupname = option.groupName;
            if (option && opt_groupname) {
                const optgroup = this.optionGroupMap[opt_groupname];
                if (optgroup) {
                    const ind = optgroup.members.findIndex(item => item.id === id);
                    optgroup.members.splice(ind, 1);
                }
            }
            if (option) {
                option.groupName = undefined;
            }
        });
    }

    changeGroupName(oldname: string, newname: string) {
        const group = this.optionGroupMap[oldname];
        const members_ids = group.members.map(item => item.id);
        if (members_ids) {
            members_ids.forEach(id => {
                const option = this.optionsMap[id];
                if (option) {
                    option.groupName = newname;
                }
            });
        }
        if (group) {
            group.name = newname;
            const newGroup = _.clone(group);
            delete this.optionGroupMap[oldname];
            this.optionGroupMap[newname] = newGroup;
        }
    }

    deleteGroup(name: string) {
        const group = this.optionGroupMap[name];
        if (!group) {
            return this;
        }
        const members_ids = group.members.map(item => item.id);
        if (members_ids) {
            members_ids.forEach(id => {
                const option = this.optionsMap[id];
                if (option) {
                    option.groupName = undefined;
                }
            });
        }
        delete this.optionGroupMap[name];
    }

    setOptionTypeFor(optionId: string, newType: IValueType) {
        const opt = this.optionsMap[optionId];
        if (opt) {
            opt.type = newType;
            opt.value = undefined;
        }
    }
}
export function optionGroupToJSON(a: IOptionGroup) {
    return ({
        id: a.id,
        name: a.name,
        appearingCondition: QACondition.toJSON(a.appearingCondition),
        members: a.members.map(item => optionToJSON(item)),
    });
}

export function optionFromJSON(a: any) {
    const option: IOption = {
        groupName: a.groupName,
        appearingCondition: QACondition.fromJSON(a.appearingCondition),
        id: a.id,
        value: a.value,
    };
    if(a.type) option.type= answerTypeFromJSON(a.type);
    return option;
}

export function optionToJSON(a: IOption) {
    return ({
        appearingCondition: QACondition.toJSON(a.appearingCondition),
        type: a.type ? answerTypeToJSON(a.type) : undefined,
        id: a.id,
        value: a.value,
        groupName: a.groupName,
    });
}

