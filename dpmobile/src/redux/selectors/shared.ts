import { DAppState } from "../actions/types";

export const $getRootForm = (state: DAppState, props) => state.rootForms;
export const $getRootFormId = (state: DAppState, props) => props.rootId;
export const $getQuestionId = (state, props) => props.questionId;
export const $getFilledForms = (state: DAppState, props) => state.filledForms;
export const $getFilledFormId = (state, props) => props.formId;
export const $getPathForQuestion = (state, props) => props.path;
export const $getProps = (state, props) => props;
export const $getState = (state: DAppState, props) => state;
export const $getSectionId = (state, props) => props.sectionId;
export const $getValueLocationName = (state, props) => props.valueLocationName;
export const $getFormId = (state: DAppState, props: any, formId: string): string => props.formId || formId;
export const $getNodeId = (state: DAppState, props: any, id: string) => id|| props.id|| props.sectionId|| props.questionId;
