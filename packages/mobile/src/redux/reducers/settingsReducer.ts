import produce from "immer";
import { SettingActions, TOGGLE_PAGER_MODE, SET_THEME } from "../actions";
import { SettingsState } from "../actions/types";

export const initialState: SettingsState = {
    pagerModeEnabled: true,
    theme: "Eva Dark"
}
export function settingsReducer(state = initialState, action: SettingActions) {
    switch (action.type) {

        case TOGGLE_PAGER_MODE:
            return produce(state, draft => {
                draft.pagerModeEnabled = !state.pagerModeEnabled
            });
        case SET_THEME:
            return produce(state, draft => {
                draft.theme = action.payload.themeName
            });

        default:
            return state;
    }
}