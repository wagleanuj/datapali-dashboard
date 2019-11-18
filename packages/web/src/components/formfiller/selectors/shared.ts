import { IAppState } from "packages/web/src/types";

export const $getRootForm = (state, props) => state.rootForms;
export const $getRootFormId = (state: IAppState, props) => props.rootId;
export const $getQuestionId = (state, props) => props.questionId || props.id;
export const $getFilledForms = (state: IAppState, props) => state.filledForms;
export const $getFilledFormId = (state, props) => props.formId;
export const $getPathForQuestion = (state, props) => props.path;
export const $getProps = (state, props) => props;
export const $getState = (state: IAppState, props) => state;
export const $getSectionId = (state, props) => props.sectionId;
export const $getValueLocationName = (state, props) => props.valueLocationName;
export const $getFormId = (state: IAppState, props: any, formId: string): string => props.formId || formId;
export const $getNodeId = (state: IAppState, props: any, id: string) => id || props.id || props.sectionId || props.questionId;

