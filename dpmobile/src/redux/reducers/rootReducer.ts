import _ from "lodash";
import { combineReducers } from "redux";
import { filledFormReducer } from "./filledFormReducer";
import { availableFormsReducer } from "./availableFormsReducer";
import { userReducer } from "./userReducer";
import { AppState } from "../actions/types";
import { ActionTypes, ADD_AVAILABLE_FORM, UPDATE_FORM_ANSWER, ADD_FILLED_FORM } from "../actions";
import produce from "immer";

export const rootReducer = combineReducers({
    filledForms: filledFormReducer,
    availableForms: availableFormsReducer,
    user: userReducer
});

export function rootReducer_(state: AppState = {
    availableForms: {},
    filledForms: {},
    user: {
        availableForms: [],
        filledForms: [],
        firstName: '',
        id: '',
        lastName: '',
        token: ''
    }
}, action: ActionTypes) {
    switch (action.type) {
        case ADD_FILLED_FORM:
            console.log('adding shit')
            return produce(state, draft => {
                draft.filledForms = filledFormReducer(draft.filledForms, action);
            })
        case UPDATE_FORM_ANSWER:
            const draft = _.cloneDeep(state);
            draft.filledForms = filledFormReducer(draft.filledForms, action);
            return {...state, filledForms: draft.filledForms};

        default:
            return state;
    }
}