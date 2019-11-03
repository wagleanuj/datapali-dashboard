
export interface IAppState {
    user: IUser;
    availableForms: IAvailableFormsState;
    filledForms: IFilledFormsState;
    form:any;
}
export interface IUser {
    firstName: string;
    lastName: string;
    accountType: EUserType;
    availableForms: string[];
    filledForms: string[];
    id: string;
    token: string;
}

export enum EUserType {
    SURVEYOR = 'surveyor',
    ADMIN = 'admin'
}
export interface IAvailableFormsState {
    byId: { [key: string]: IRootForm },
    ids: string[]
}
export type IRootForm = any; //TODO;

export interface IFilledFormsState {
    byId: { [key: string]: IFilledForm },
    ids: string[]
}

export interface IFilledForm {
    startedDate: number;
    completedDate?: number;
    formId: string;
    filledBy: string;
    id: string;
    submitted?: boolean;
}

export enum EAppTheme {
    DARK = 'dark',
    LIGHT = 'light'
}