import { ADD_FILLED_FORM, ADD_ITEM_TO_ROOT_FORM, ADD_ROOT_FORM, DELETE_FILLED_FORM, FilledFormActions, JUMP_TO, LOGOUT, MARK_AS_SUBMITTED, NEXT_FORM_ITEM, PREV_FORM_ITEM, REPLACE_ROOT_FORMS, RootFormActions, SET_USER, TOGGLE_PAGER_MODE, UPDATE_FILLED_FORMS, UPDATE_FORM_ANSWER, UPDATE_QUESTION, UPDATE_SECTION } from ".";
import { IQuestion, ISection } from "../components/formfiller/types";
import { IFilledForm, IRootForm, IUser } from "../types";


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

export function handleAddNewForm(id: string, filledForm: IFilledForm): FilledFormActions {
    return {
        type: ADD_FILLED_FORM,
        payload: {
            id,
            filledForm
        }
    }
}
export function handleAddRootForm(id: string, root: IRootForm): RootFormActions {
    return {
        type: ADD_ROOT_FORM,
        payload: {
            id: id,
            root: root,
        }
    }
}
export function handleAddItemToRootForm(rootId: string, parentId: string, item: ISection | IQuestion): RootFormActions {
    return {
        type: ADD_ITEM_TO_ROOT_FORM,
        payload: {
            rootId,
            parentId,
            item
        }
    }
}

export function handleDeleteForms(formIds: string[]): FilledFormActions {
    return {
        type: DELETE_FILLED_FORM,
        payload: {
            formIds: formIds
        }
    }
}
export function handleMarkFormAsSubmitted(formIds: string[]): FilledFormActions {
    return {
        type: MARK_AS_SUBMITTED,
        payload: {
            formIds: formIds
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

export function handleSetUser(user: IUser) {
    return {
        type: SET_USER,
        payload: user
    }
}

export function handleSetRootForms(rootForms: { [key: string]: any }) {
    return {
        type: REPLACE_ROOT_FORMS,
        payload: rootForms
    }
}
export function handleUpdateQuestion(rootId: string, question: IQuestion) {
    return {
        type: UPDATE_QUESTION,
        payload: {
            rootId: rootId,
            question: question
        }
    }
}
export function handleUpdateSection(rootId: string, section: ISection) {
    return {
        type: UPDATE_SECTION,
        payload: {
            rootId: rootId,
            section: section
        }
    }
}

export function handleSetFilledForms(filled: { [key: string]: IFilledForm }) {
    return {
        type: UPDATE_FILLED_FORMS,
        payload: filled
    }
}
export function handleLogout() {
    return {
        type: LOGOUT,
        payload: undefined
    }
}

export function handleTogglePagerMode() {
    return {
        type: TOGGLE_PAGER_MODE,
        payload: undefined
    }
}

