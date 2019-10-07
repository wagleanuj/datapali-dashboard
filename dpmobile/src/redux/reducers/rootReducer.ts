import _ from "lodash";
import { combineReducers } from "redux";
import { filledFormReducer } from "./filledFormReducer";
import { availableFormsReducer } from "./availableFormsReducer";
import { userReducer } from "./userReducer";

export const rootReducer = combineReducers({
    filledForms: filledFormReducer,
    availableForms: availableFormsReducer,
    user: userReducer
})