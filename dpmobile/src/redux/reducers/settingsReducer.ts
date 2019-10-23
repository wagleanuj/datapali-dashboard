import produce from "immer";
import { SettingActions, SET_THEME, TOGGLE_PAGER_MODE } from "../actions";
import { SettingsState } from "../actions/types";

export const initialState: SettingsState = {
    pagerModeEnabled: true,
}
export function settingsReducer(state = initialState, action: SettingActions) {
    switch (action.type) {
       
        case TOGGLE_PAGER_MODE:
            return produce(state, draft => {
                draft.pagerModeEnabled = !state.pagerModeEnabled
            });

        default:
            return state;
    }
}