import { AnyAction, combineReducers } from "redux";
import { reducer } from "redux-form";
import { LOGOUT } from "../actions";
import { IAppState } from "../types";
import { filledFormReducer, initialFilledFormsState } from "./filledFormReducer";
import { initialRootFormsState, rootFormsReducer } from "./rootFormsReducer";
import { initialUserState, userReducer } from "./userReducer";

export const combinedReducers = combineReducers<IAppState>({
    user: userReducer,
    rootForms: rootFormsReducer,
    filledForms: filledFormReducer,
    form: reducer,
});

export const initialAppState: IAppState = {
    rootForms: initialRootFormsState,
    user: initialUserState,
    filledForms: initialFilledFormsState,
    form: {}
}

export const rootReducers = (state: IAppState, action: AnyAction): IAppState | undefined => {
    if (action.type === LOGOUT) {
        state = initialAppState;
    }
    return combinedReducers(state, action);
}

