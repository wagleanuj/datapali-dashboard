import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';
import { filledFormReducer } from "./filledFormReducer";
import { userReducer } from "./userReducer";
import { rootFormsReducer } from "./rootFormReducer";


export const rootReducer = combineReducers({
    filledForms: filledFormReducer,
    user: userReducer,
    form: formReducer,
    rootForms: rootFormsReducer,
});
