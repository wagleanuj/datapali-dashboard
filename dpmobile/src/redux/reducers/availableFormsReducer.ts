import { ADD_AVAILABLE_FORM, AvailableFormActions, DELETE_AVAILABLE_FORM, REPLACE_AVAILABLE_FORMS } from "../actions";

const initialState = {

}
export function availableFormsReducer(
    state = initialState,
    action: AvailableFormActions
) {
    switch (action.type) {
        case ADD_AVAILABLE_FORM:
            return state;
        case REPLACE_AVAILABLE_FORMS:
            return state;
        case DELETE_AVAILABLE_FORM:
            return state;
        default:
            return state;
    }
}