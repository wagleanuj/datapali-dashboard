import { combineReducers, createStore } from "redux";
import { IAppState } from "../types";
import { userReducer } from "./userReducer";
import { filledFormReducer } from "./filledFormReducer";
import { rootFormsReducer } from "./availableFormReducer";
import { reducer } from "redux-form";

export const rootReducer = combineReducers<IAppState>({
    user: userReducer,
    availableForms: rootFormsReducer,
    filledForms: filledFormReducer,
    form: reducer

});

export const store = createStore(rootReducer);

