import { RootSection } from "dpform";
import { ADD_FILLED_FORM, FilledFormActions, JUMP_TO, NEXT_FORM_ITEM, PREV_FORM_ITEM, UPDATE_FORM_ANSWER } from ".";

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

export function handleAddNewForm(root: RootSection, userId: string): FilledFormActions {
    return {
        type: ADD_FILLED_FORM,
        payload: {
            root: root,
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