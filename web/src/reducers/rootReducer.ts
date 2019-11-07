import { Action, combineReducers, AnyAction, Reducer } from "redux";
import { reducer } from "redux-form";
import { IAppState } from "../types";
import { initialRootFormsState, rootFormsReducer } from "./createdFormsReducer";
import { filledFormReducer, initialFilledFormsState } from "./filledFormReducer";
import { initialUserState, userReducer } from "./userReducer";
import { LOGOUT } from "../actions";

export const combinedReducers = combineReducers<IAppState>({
    user: userReducer,
    createdForms: rootFormsReducer,
    filledForms: filledFormReducer,
    form: reducer,
});

export const initialAppState: IAppState = {
    createdForms: initialRootFormsState,
    user: initialUserState,
    filledForms: initialFilledFormsState,
    form: {}
}

export const rootReducers  = (state: IAppState, action: AnyAction): IAppState|undefined=> {
    if (action.type === LOGOUT) {
        state = initialAppState;
    }
    return combinedReducers(state, action);
}

