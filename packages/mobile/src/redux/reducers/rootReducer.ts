import { combineReducers, Action } from "redux";
import { reducer as formReducer } from 'redux-form';
import { LOGOUT } from "../actions";
import { DAppState } from "../actions/types";
import { filledFormReducer } from "./filledFormReducer";
import { rootFormsReducer } from "./rootFormReducer";
import { userReducer } from "./userReducer";
import { settingsReducer } from "./settingsReducer";

const initialState: DAppState = {
    rootForms: { byId: {}, ids: [] },
    user: {
        filledForms: [],
        availableForms: [],
        firstName: '',
        id: '',
        lastName: '',
        token: '',
    },
    filledForms: { byId: {}, ids: [] },
    form: {}

}
const combinedReducers = combineReducers<DAppState>({
    filledForms: filledFormReducer,
    user: userReducer,
    form: formReducer,
    settings: settingsReducer,
    rootForms: rootFormsReducer,
});

export const rootReducers = (state: DAppState, action: Action) => {
    if (action.type === LOGOUT) {
        state = initialState;
    }
    return combinedReducers(state, action);
}
