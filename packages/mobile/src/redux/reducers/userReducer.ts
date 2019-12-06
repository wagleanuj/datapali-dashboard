import { SET_USER, UserActions } from "../actions";
import { User } from "../actions/types";
export const initialState: User = {
    filledForms: [],
    availableForms: [],
    firstName: '',
    id: '',
    lastName: '',
    token: '',
}
export function userReducer(state = initialState, action: UserActions) {
    switch (action.type) {
        case SET_USER:
            const payload = action.payload;
            return { ...state, ...payload };
        default:
            return state;
    }
}