import { AppState } from "../actions/types";

export const $getRootForm = (state: AppState, props) => state.rootForms;
export const $getRootFormId = (state: AppState, props) => props.rootId;
export const $getQuestionId = (state, props) => props.questionId;
export const $getFilledForms = (state: AppState, props) => state.filledForms;
export const $getFilledFormId = (state, props) => props.formId;
export const $getPathForQuestion = (state, props) => props.path;
export const $getProps = (state, props) => props;
export const $getState = (state: AppState, props) => state;
export const $getSectionId = (state, props) => props.sectionId;
export const $getValueLocationName = (state, props) => props.valueLocationName;
export const $getFormId = (state: AppState, props: any, formId: string): string => props.formId || formId;
export const $getNodeId = (state: AppState, props: any) => props.id|| props.sectionId|| props.questionId;
