import { RootFormActions, ADD_ROOT_FORM, REPLACE_ROOT_FORMS, DELETE_ROOT_FORM } from "../actions";
import { RootFormsState } from "../actions/types";

const initialState: RootFormsState = {
    byId: {},
    ids: []
}
export function rootFormsReducer(
    state = initialState,
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