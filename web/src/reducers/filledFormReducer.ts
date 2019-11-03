import { FilledFormActions } from "../actions";
import { IFilledForm, IFilledFormsState } from "../types";


const initialState: IFilledFormsState = {
   byId: {},
   ids:[]
}

export function filledFormReducer(state = initialState, action: FilledFormActions) {
    switch (action.type) {
        default:
            return state;
    }
}