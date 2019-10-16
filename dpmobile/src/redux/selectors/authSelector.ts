import { createSelector } from "reselect";
import { AppState, User } from "../actions/types";
const $getState = (state: AppState, props) => state;
const $getProps = (state, props) => props;

export const getUser = createSelector([$getState], (state) => {
    return state.user;
});

export const getUserToken = createSelector([getUser], (user: User) => {
    if (!user) return undefined;
    return user.token;
})