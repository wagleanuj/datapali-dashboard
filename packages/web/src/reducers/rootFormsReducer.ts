import produce from "immer";
import { ADD_ROOT_FORM, DELETE_ROOT_FORM, REPLACE_ROOT_FORMS, RootFormActions } from "../actions";
import { IRootFormsState } from "../types";
export const initialRootFormsState: IRootFormsState = {
    byId: {},
    ids: []
}
export function rootFormsReducer(
    state = initialRootFormsState,
    action: RootFormActions
): IRootFormsState {
    switch (action.type) {
        case ADD_ROOT_FORM:
            return produce(state, draft => {
                const payload = action.payload;
                if (!draft.ids.includes(payload.id)) {
                    draft.ids.push(payload.id)
                }
                draft.byId[payload.id] = payload.root;
            });

        case REPLACE_ROOT_FORMS:
            const payload = action.payload;
            return { ...state, byId: payload.roots, ids: Object.keys(payload) };
        case DELETE_ROOT_FORM:
            return state;

        default:
            return state;
    }
}