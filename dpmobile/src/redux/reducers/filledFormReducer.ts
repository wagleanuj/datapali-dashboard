import { getRandomId } from "dpform";
import produce from "immer";
import _ from "lodash";
import { ADD_FILLED_FORM, DELETE_FILLED_FORM, FilledFormActions, JUMP_TO, NEXT_FORM_ITEM, PREV_FORM_ITEM, UPDATE_FILLED_FORMS } from "../actions";
import { FilledForm, FilledFormsState } from "../actions/types";
import { Helper } from "../helper";
const FilledFormItem: FilledForm = {
    completedDate: undefined,
    currentIndex: undefined,
    filledBy: undefined,
    formId: undefined,
    history: undefined,
    id: undefined,
    startedDate: undefined
}

const initialState: FilledFormsState = {
    byId: {},
    ids: []
}
export function filledFormReducer(
    state = initialState,
    action: FilledFormActions
) {
    switch (action.type) {
        case ADD_FILLED_FORM:
            const { rootId, userId } = action.payload;
            if (!rootId) return state;
            let newForm: FilledForm = {
                completedDate: undefined,
                startedDate: new Date().getTime(),
                filledBy: userId,
                formId: rootId,
                id: getRandomId("filledform-"),
                currentIndex: 0,

            };
            let newState = produce(state, draft => {
                draft.byId[newForm.id] = newForm;
                draft.ids.push(newForm.id);
            })
            return newState;

        case UPDATE_FILLED_FORMS:
            const payload = _.cloneDeep(action.payload);
            return { ...state, byId: payload, ids: Object.keys(payload) };
        case DELETE_FILLED_FORM:
            return produce(state, draft => {
                delete draft.byId[action.payload.formId];
                const index = draft.ids.findIndex(item => item === action.payload.formId);
                if (index > -1) draft.ids.splice(index, 1);
            })

        case JUMP_TO:
            const { formId, index: newIndex } = action.payload
            let newHistory = state[formId].history.slice(0);
            let currentIndex = state[formId].currentIndex;
            const nextSection = state[formId].content[newIndex];
            if (!nextSection) return state;
            const isValid = Helper.evaluateCondition(nextSection.appearingCondition, state.answerStore, state.questionStore);
            if (!isValid) return state;
            if (newIndex > currentIndex) {
                newHistory.push(currentIndex);
                for (let i = newHistory[newHistory.length - 1] + 1; i < newIndex; i++) {
                    newHistory.push(i);
                }
            } else if (newIndex < currentIndex) {
                newHistory = [];
                for (let i = 0; i < newIndex; i++) {
                    newHistory.push(i);
                }
            }
            return {
                ...state,
                history: newHistory,
                currentSectionIndex: newIndex
            }
        case NEXT_FORM_ITEM:
            return (function () {
                const { formId } = action.payload;
                return produce(state, draft => {
                    const form = draft[formId];
                    form.currentIndex++
                })
            })()
        case PREV_FORM_ITEM:
            return (function () {
                const { formId } = action.payload;
                return produce(state, draft => {
                    const form = draft[formId];
                    form.currentIndex--
                })
            })();
     
        default:
            return state;
    }
}