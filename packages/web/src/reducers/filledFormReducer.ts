import { getRandomId } from "@datapali/dpform";
import produce from "immer";
import { ADD_FILLED_FORM, FilledFormActions } from "../actions";
import { IFilledForm, IFilledFormsState } from "../types";


export const initialFilledFormsState: IFilledFormsState = {
    byId: {},
    ids: []
}

export function filledFormReducer(state = initialFilledFormsState, action: FilledFormActions) {
    switch (action.type) {
        case ADD_FILLED_FORM:
            const { rootId, userId } = action.payload;
            if (!rootId) return state;
            let newForm: IFilledForm = {
                completedDate: undefined,
                startedDate: new Date().getTime(),
                filledBy: userId,
                formId: rootId,
                id: getRandomId("filledform-"),

            };
            return produce(state, draft => {
                draft.byId[newForm.id] = newForm;
                draft.ids.push(newForm.id);
            })

        default:
            return state;
    }
}