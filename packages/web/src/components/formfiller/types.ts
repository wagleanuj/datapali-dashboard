import { IContent, IDupeSettings, IOption, IOptionGroup, IValueType, QACondition } from "@datapali/dpform/src";

export const ROOTSECTION = "root";
export interface IRootSection {
    _type: typeof ROOTSECTION;
    id: string;
    name: string;
    childNodes: string[];
}
export const QUESTION = "question";
export interface IQuestion {
    _type: typeof QUESTION;
    id: string;
    answerType: IValueType;
    questionContent: IContent;
    options: IAnswerOptions;
    isRequired: boolean;
    creationDate: number;
    customId: string;
}
export const SECTION = "section";
export interface ISection {
    _type: typeof SECTION;
    name: string;
    id: string;
    customId: string;
    appearingCondition: QACondition;
    childNodes: string[];
    duplicatingSettings: IDupeSettings;
}

export interface IAnswerOptions {
    _type?: string;
    optionsMap: { [key: string]: IOption }
    optionGroupMap: { [key: string]: IOptionGroup }

}