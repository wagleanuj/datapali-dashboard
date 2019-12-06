import produce from "immer";
import { ADD_FILLED_FORM, FilledFormActions } from "../actions";
import { IFilledFormsState } from "../types";


export const initialFilledFormsState: IFilledFormsState = {
    byId: {},
    ids: []
}

export function filledFormReducer(state = initialFilledFormsState, action: FilledFormActions) {
    switch (action.type) {
        case ADD_FILLED_FORM:
            const { id, filledForm } = action.payload;

            return produce(state, draft => {
                draft.byId[id] = filledForm;
                if (!draft.ids.includes(filledForm.id)) draft.ids.push(filledForm.id);
            })

        default:
            return state;
    }
}