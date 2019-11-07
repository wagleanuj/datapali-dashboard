import { FilledFormActions } from "../actions";
import { IFilledForm, IFilledFormsState } from "../types";


export const initialFilledFormsState: IFilledFormsState = {
   byId: {},
   ids:[]
}

export function filledFormReducer(state = initialFilledFormsState, action: FilledFormActions) {
    switch (action.type) {
        default:
            return state;
    }
}