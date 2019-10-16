import { RootSection } from "dpform";
import { ADD_FILLED_FORM, FilledFormActions, JUMP_TO, NEXT_FORM_ITEM, PREV_FORM_ITEM, UPDATE_FORM_ANSWER, SET_USER, REPLACE_ROOT_FORMS, UPDATE_FILLED_FORMS } from ".";
import { User, FilledForm } from "./types";

export function handleNext(formId: string): FilledFormActions {
    return {
        type: NEXT_FORM_ITEM,
        payload: {
            formId: formId
        }
    }
}

export function handlePrev(formId: string): FilledFormActions {
    return {
        type: PREV_FORM_ITEM,
        payload: {
            formId: formId
        }
    }
}

export function handleJump(formId: string, newSectionIndex: number): FilledFormActions {
    return {
        type: JUMP_TO,
        payload: {
            formId: formId,
            index: newSectionIndex
        }
    }
}

export function handleAddNewForm(root: string, userId: string): FilledFormActions {
    return {
        type: ADD_FILLED_FORM,
        payload: {
            rootId: root,
            userId: userId
        }
    }
}
export function handleUpdateAnswer(formId: string, path: number[], questionId: string, value: string) {
    return {
        type: UPDATE_FORM_ANSWER,
        payload: {
            formId: formId,
            path: path,
            questionId: questionId,
            value: value

        }
    }
}

export function handleSetUser(user: User) {
    return {
        type: SET_USER,
        payload: user
    }
}

export function handleSetRootForms(rootForms: {[key:string]:any}){
    return {
        type: REPLACE_ROOT_FORMS,
        payload: rootForms
    }
}

export function handleSetFilledForms(filled: {[key:string]:FilledForm}){
    return {
        type: UPDATE_FILLED_FORMS,
        payload: filled
    }
}