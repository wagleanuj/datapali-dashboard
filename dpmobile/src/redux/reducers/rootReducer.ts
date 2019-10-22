import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';
import { LOGOUT } from "../actions";
import { AppState } from "../actions/types";
import { filledFormReducer } from "./filledFormReducer";
import { rootFormsReducer } from "./rootFormReducer";
import { userReducer } from "./userReducer";

const initialState: AppState = {
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
const combinedReducers = combineReducers({
    filledForms: filledFormReducer,
    user: userReducer,
    form: formReducer,
    rootForms: rootFormsReducer,
});
export const rootReducers = (state, action) => {
    if (action.type === LOGOUT) {
        state  = initialState;
    }
    return combinedReducers(state, action);
}
