import { DAppState } from "../actions/types";

export const getPagerModeStatus = (state: DAppState, props: any) => state.settings.pagerModeEnabled
export const getCurrentTheme = (state: DAppState, props: any) => state.settings.theme;