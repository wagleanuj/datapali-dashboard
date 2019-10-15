import produce from "immer";
import _ from "lodash";
import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';
import { ActionTypes, ADD_FILLED_FORM, UPDATE_FORM_ANSWER } from "../actions";
import { AppState } from "../actions/types";
import { availableFormsReducer } from "./availableFormsReducer";
import { filledFormReducer } from "./filledFormReducer";
import { userReducer } from "./userReducer";
import { rootFormReducer } from "./rootFormReducers";

export const rootReducer = combineReducers({
    filledForms: filledFormReducer,
    availableForms: availableFormsReducer,
    user: userReducer,
    form: formReducer,
    rootForms: rootFormReducer,
});

export function rootReducer_(state: AppState = {
    availableForms: {},
    rootForms: {},
    filledForms: {},
    user: {
        availableForms: [],
        filledForms: [],
        firstName: '',
        id: '',
        lastName: '',
        token: ''
    },
    filled: {}
}, action: ActionTypes) {
    switch (action.type) {
        case ADD_FILLED_FORM:
            return produce(state, draft => {
                draft.filledForms = filledFormReducer(draft.filledForms, action);
            })
        case UPDATE_FORM_ANSWER:
            const draft = _.cloneDeep(state);
            draft.filledForms = filledFormReducer(draft.filledForms, action);
            return { ...state, filledForms: draft.filledForms };

        default:
            return state;
    }
}