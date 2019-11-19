import { IQuestion, IRootSection, ISection } from "../components/formfiller/types";

export interface IAppState {
    user: IUser;
    rootForms: IRootFormsState;
    filledForms: IFilledFormsState;
    form: any;
}
export interface IUser {
    firstName: string;
    lastName: string;
    accountType: EUserType;
    availableForms: string[];
    filledForms: string[];
    id: string;
    token: string;
    createdForms: string[]
}

export enum EUserType {
    SURVEYOR = 'surveyor',
    ADMIN = 'admin'
}
export interface IRootFormsState {
    byId: { [key: string]: IRootForm },
    ids: string[]
}
export type IRootForm = {
    [key: string]: ISection | IRootSection | IQuestion
};
export interface IFilledFormsState {
    byId: { [key: string]: IFilledForm },
    ids: string[]
}

export interface IFilledForm {
    startedDate: number;
    completedDate?: number;
    formId: string;
    filledBy: IUser;
    id: string;
    submitted?: boolean;
    answerStore?: any;
}


export enum EAppTheme {
    DARK = 'dark',
    LIGHT = 'light'
}