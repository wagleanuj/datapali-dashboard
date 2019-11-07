import { ADD_ROOT_FORM, DELETE_ROOT_FORM, REPLACE_ROOT_FORMS, RootFormActions } from "../actions";
import { ICreatedFormsState } from "../types";

export const initialRootFormsState: ICreatedFormsState = {
    byId: {},
    ids: []
}
export function rootFormsReducer(
    state = initialRootFormsState,
    action: RootFormActions
) {
    switch (action.type) {
        case ADD_ROOT_FORM:

            return state;
        case REPLACE_ROOT_FORMS:
            const payload = action.payload;
            return { ...state, byId: payload, ids: Object.keys(payload) };
        case DELETE_ROOT_FORM:
            return state;

        default:
            return state;
    }
}