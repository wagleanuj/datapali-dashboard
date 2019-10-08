import { SurveyActions, NEXT, PREV, JUMP, FilledFormActions, ADD_FILLED_FORM, AddFilledForm, UPDATE_FORM_ANSWER } from ".";
import { RootSection } from "dpform";

export function handleNext(): SurveyActions {
    return {
        type: NEXT,
        payload: undefined
    }
}

export function handlePrev(): SurveyActions {
    return {
        type: PREV,
        payload: undefined
    }
}

export function handleJump(newSectionIndex: number): SurveyActions {
    return { type: JUMP, payload: { index: newSectionIndex } }
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
export function handleUpdateAnswer(formId:string, path: number[], questionId: string, value: string){
    return {
        type: UPDATE_FORM_ANSWER,
        payload:{
            formId: formId,
            path: path,
            questionId: questionId ,
            value: value
            
        }
    }
}