import { QACondition } from './condition';
import { IValueType } from './valueType';
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
export declare class AnswerOptions {
    optionsMap: {
        [key: string]: IOption;
    };
    optionGroupMap: {
        [key: string]: IOptionGroup;
    };
    options: (IOption | IOptionGroup)[];
    private opt_count;
    private group_count;
    static toJSON(a: AnswerOptions): {
        optionsMap: {
            [x: string]: {
                appearingCondition: {
                    [key: string]: any;
                } | undefined;
                type: {
                    [key: string]: any;
                } | undefined;
                id: string;
                value: string | undefined;
                groupName: string | undefined;
            };
        };
        optionGroupMap: {
            [x: string]: {
                id: string;
                name: string;
                appearingCondition: {
                    [key: string]: any;
                } | undefined;
                members: {
                    appearingCondition: {
                        [key: string]: any;
                    } | undefined;
                    type: {
                        [key: string]: any;
                    } | undefined;
                    id: string;
                    value: string | undefined;
                    groupName: string | undefined;
                }[];
            };
        };
    };
    static fromJSON(d: any): AnswerOptions;
    readonly SortedOptions: {
        groups: IOptionGroup[];
        rootOptions: IOption[];
    };
    addOption(option?: IOption): this;
    addGroup(groupname?: string): IOptionGroup;
    setValueForOption(id: string, newValue: string): this;
    deleteOption(id: string): this;
    assignOptionToGroup(optionIds: string[], groupName: string): this;
    setConditionForOption(optionId: string, condition: QACondition): this;
    setConditionForGroup(groupname: string, condition: QACondition): this;
    unassignGroup(ids: string[]): void;
    changeGroupName(oldname: string, newname: string): void;
    deleteGroup(name: string): this | undefined;
    setOptionTypeFor(optionId: string, newType: IValueType): void;
}
export declare function optionGroupToJSON(a: IOptionGroup): {
    id: string;
    name: string;
    appearingCondition: {
        [key: string]: any;
    } | undefined;
    members: {
        appearingCondition: {
            [key: string]: any;
        } | undefined;
        type: {
            [key: string]: any;
        } | undefined;
        id: string;
        value: string | undefined;
        groupName: string | undefined;
    }[];
};
export declare function optionFromJSON(a: any): IOption;
export declare function optionToJSON(a: IOption): {
    appearingCondition: {
        [key: string]: any;
    } | undefined;
    type: {
        [key: string]: any;
    } | undefined;
    id: string;
    value: string | undefined;
    groupName: string | undefined;
};
