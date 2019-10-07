import { RootSection } from "dpform";

export const UPDATE_ANSWER = 'UPDATE_ANSWER';
interface UpdateAnswer {
    type: typeof UPDATE_ANSWER;
    payload: {
        path: number[];
        questionId: string;
        value: string;
    }
}

export type AnswerActionTypes = UpdateAnswer;
//survey form actions
export const NEXT = "next";
interface Next {
    type: typeof NEXT;
    payload: undefined;
}

export const PREV = 'prev';
interface Prev {
    type: typeof PREV;
    payload: undefined;
}

export const JUMP = 'jump';
interface Jump {
    type: typeof JUMP;
    payload: {
        index: number;
    }
}
export type SurveyActions = Next | Prev | Jump

export const ADD_FILLED_FORM = 'add-filled-form';
export interface AddFilledForm {
    type: typeof ADD_FILLED_FORM;
    payload: {
        root: RootSection,
        userId: string
    }
}

export const DELETE_FILLED_FORM = 'delete-filled-form';
export interface DeleteFilledForm {
    type: typeof DELETE_FILLED_FORM;
    payload: {
        id: string
    }
}

export const UPDATE_FORM_ANSWER = 'update-form-answer';
export interface UpdateFormAnswer {
    type: typeof UPDATE_FORM_ANSWER;
    payload: {
        formId: string;
        path: number[];
        questionId: string;
        value: string;
    }
}

export const NEXT_FORM_ITEM = 'next-form-item';
export interface NextFormItem {
    type: typeof NEXT_FORM_ITEM;
    payload: {
        formId: string;
    }
}

export const PREV_FORM_ITEM = 'prev-form-item';
export interface PrevFormItem {
    type: typeof PREV_FORM_ITEM;
    payload: {
        formId: string;
    }
}

export const JUMP_TO = 'jump-to';
export interface JumpTo {
    type: typeof JUMP_TO;
    payload: {
        formId: string;
        index: number;
    }
}
export type FilledFormActions = AddFilledForm | DeleteFilledForm | UpdateFormAnswer | PrevFormItem | NextFormItem | JumpTo;

//available forms action types

export const ADD_AVAILABLE_FORM = 'add-available-form';
export interface AddAvailableForm {
    type: typeof ADD_AVAILABLE_FORM;
    payload: {
        root: RootSection
    }
}

export const REPLACE_AVAILABLE_FORMS = 'replace-available-forms';
export interface ReplaceAvailableForms {
    type: typeof REPLACE_AVAILABLE_FORMS;
    payload: {
        roots: [RootSection]
    }
}

export const DELETE_AVAILABLE_FORM = 'delete-available-form';
export interface DeleteAvailableForm {
    type: typeof DELETE_AVAILABLE_FORM;
    payload: {
        ids: string[]
    }
}
export type AvailableFormActions = AddAvailableForm | ReplaceAvailableForms | DeleteAvailableForm;


//user actions
export const SET_USER = 'set-user';
export interface SetUser {
    type: typeof SET_USER;
    payload: {
        firstName: string;
        lastName: string;
        token: string;
        availableForms?: string[];
        filledForms?: string[];
    }
}

export type UserActions = SetUser;
