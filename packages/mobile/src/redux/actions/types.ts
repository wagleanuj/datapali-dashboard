import { AnswerOptions, IAutoAnswer, IDupeSettings, QACondition, QAQuestion, RootSection } from "@datapali/dpform";
import { ThemeKey } from "../../themes";

export interface User {
    firstName: string;
    lastName: string;
    id: string;
    availableForms: string[],
    filledForms: string[],
    token?: string;
}

export interface FilledForm {
    startedDate: number;
    completedDate: number;
    formId: string;
    filledBy: string;
    id: string;
    submitted?: boolean;
}

export interface AnswerState {
    answers: Map<string, Map<string, string>>;
}
export interface SurveyViewState {
    currentIndex: number;

}

export interface IOption_ {
    id: string;
    value: string;
    items?: IOption_[]
}
export interface Question_ {
    path: number[];
    title: string;
    visible: boolean;
    autoFillValue: string;
    value: string;
    filterdOptions?: IOption_[];
    options: AnswerOptions;
    appearingCondition: QACondition;
    autoAnswer: IAutoAnswer;
    isRequired: boolean;
    id: string;
}

export interface Section_ {
    path: number[];
    title: string;
    desc: string;
    content: Array<Array<Section_ | Question_>>
    visible: boolean;
    duplicatingSettings: IDupeSettings;
    appearingCondition: QACondition;
}

export interface SurveyState {
    currentIndex: number;
    answerStore: AnswerState;
    content: Array<Section_ | Question_>;
    history: number[];
    questionStore: Map<string, QAQuestion>;
}
export interface AvailableFormsState {
    [key: string]: RootSection
}
export interface FilledFormsState {
    byId: {[key: string]: FilledForm},
    ids: string[]
}
export interface RootFormsState {
    byId: {[key: string]: any},
    ids: string[]
}
export interface DAppState {
    user?: User;
    filledForms: FilledFormsState;
    rootForms:RootFormsState;
    settings: SettingsState;
    form: any;
}
export interface SettingsState {
    pagerModeEnabled: boolean;
    theme: ThemeKey;
}

export interface ISection{

}
export interface IQuestion{

}
export interface IAnswerOptions{

}
export interface ICondition{
    
}