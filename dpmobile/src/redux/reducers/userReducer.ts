import { UserActions } from "../actions";
import { User } from "../../components/forms.component";
const initialState: User = {
    filledForms: [],
    availableForms: [],
    firstName: '',
    id: '',
    lastName: ''
}
export function userReducer(state = initialState, action: UserActions) {
    switch (action.type) {
        default:
            return state;
    }
}