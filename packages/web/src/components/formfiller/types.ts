import { IContent, IDupeSettings, IOption, IOptionGroup, IValueType, QACondition } from "@datapali/dpform/src";


export interface IRootSection {
    _type:string;
    id: string;
    name: string;
    childNodes: string[];
}

export interface IQuestion {
    _type:string;
    id: string;
    answerType: IValueType;
    questionContent: IContent;
    options: IAnswerOptions;
    isRequired: boolean;
    creationDate: number;
    customId: string;
}

export interface ISection {
    _type:string;
    name: string;
    id: string;
    customId: string;
    appearingCondition: QACondition;
    childNodes: string[];
    duplicatingSettings: IDupeSettings;
}

export interface IAnswerOptions {
    _type?:string;
    optionsMap: { [key: string]: IOption }
    optionGroupMap: { [key: string]: IOptionGroup }

}