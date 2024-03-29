import { IQuestion, ISection } from "../components/formfiller/types";
import { IFilledForm, IRootForm, IUser } from "../types";


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
        id: string,
        filledForm: IFilledForm
    }
}

export const UPDATE_FILLED_FORMS = 'update-filled-form';
export interface UpdateFilledForms {
    type: typeof UPDATE_FILLED_FORMS,
    payload: {
        [key: string]: any
    }
}
export const DELETE_FILLED_FORM = 'delete-filled-form';
export interface DeleteFilledForm {
    type: typeof DELETE_FILLED_FORM;
    payload: {
        formIds: string[]
    }
}
export const MARK_AS_SUBMITTED = 'mark-as-submitted';
export interface MarkFormAsSubmitted {
    type: typeof MARK_AS_SUBMITTED;
    payload: {
        formIds: string[]
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
export type FilledFormActions = AddFilledForm | UpdateFilledForms | DeleteFilledForm | UpdateFormAnswer | PrevFormItem | NextFormItem | JumpTo | MarkFormAsSubmitted;

//available forms action types

export const ADD_ROOT_FORM = 'add-available-form';
export interface AddRootForm {
    type: typeof ADD_ROOT_FORM;
    payload: {
        root: IRootForm,
        id: string;
    }
}

export const REPLACE_ROOT_FORMS = 'replace-available-forms';
export interface ReplaceRootForms {
    type: typeof REPLACE_ROOT_FORMS;
    payload: {
        roots: { [key: string]: IRootForm }
    }
}

export const DELETE_ROOT_FORM = 'delete-available-form';
export interface DeleteRootForms {
    type: typeof DELETE_ROOT_FORM;
    payload: {
        ids: string[]
    }
}

export const ADD_ITEM_TO_ROOT_FORM = "add-item-to-root-form";
export interface AddItemToRootForm {
    type: typeof ADD_ITEM_TO_ROOT_FORM;
    payload: {
        rootId: string;
        parentId: string;
        item: ISection | IQuestion;
    }
}

export const MOVE_ITEM_IN_ROOT_FORM = "move-item-in-root-form";
export interface MoveItemInRootForm {
    type: typeof MOVE_ITEM_IN_ROOT_FORM;
    payload: {
        rootId: string;
        parentId: string;
        newParentId: string;
        itemId: string;
    }
}
export const DELETE_ITEM_IN_ROOT_FORM = "delete-item-in-root-form";
export interface DeleteItemInRootForm {
    type: typeof DELETE_ITEM_IN_ROOT_FORM;
    payload: {
        rootId: string;
        parentId: string;
        itemId: string;
    }
}

export const UPDATE_QUESTION = "update-question";
export interface UpdateQuestion {
    type: typeof UPDATE_QUESTION,
    payload: {
        rootId: string,
        question: IQuestion,
    }
}
export const UPDATE_SECTION = "update-section";
export interface UpdateSection {
    type: typeof UPDATE_SECTION,
    payload: {
        rootId: string,
        question: IQuestion,
    }
}
export type RootFormActions = AddRootForm | ReplaceRootForms | DeleteRootForms | AddItemToRootForm | MoveItemInRootForm | DeleteItemInRootForm | UpdateQuestion | UpdateSection;


//user actions
export const SET_USER = 'set-user';
export interface SetUser {
    type: typeof SET_USER;
    payload: IUser
}

export type UserActions = SetUser;
export type ActionTypes = UserActions | RootFormActions | FilledFormActions | SurveyActions;

//root actions
export const LOGOUT = 'logout';
export interface LogOut {
    type: typeof LOGOUT;
    payload: undefined;
}


export const TOGGLE_PAGER_MODE = 'toggle-pager-mode';
export interface TogglePagerMode {
    type: typeof TOGGLE_PAGER_MODE;
    payload: undefined;
}
export type SettingActions = TogglePagerMode