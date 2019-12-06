import { createSelector } from "reselect";
import { User } from "../actions/types";
import { $getState } from "./shared";


export const getUser = createSelector([$getState], (state) => {
    return state.user;
});

export const getUserToken = createSelector([getUser], (user: User) => {
    if (!user) return undefined;
    return user.token;
})