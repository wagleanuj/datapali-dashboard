import { IUser, EUserType } from "../types";
import { UserActions, SET_USER } from "../actions";

export const initialState: IUser = {
    filledForms: [],
    availableForms: [],
    firstName: '',
    id: '',
    lastName: '',
    token: '',
    accountType: EUserType.SURVEYOR
}
export function userReducer(state = initialState, action: UserActions) {
    switch (action.type) {
        case SET_USER:
            const payload = action.payload;
            console.log("setting user");
            return { ...state, ...payload };
        default:
            return state;
    }
}