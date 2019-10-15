import { getRandomId } from "dpform";
import produce from "immer";
import { FilledForm } from "../../components/forms.component";
import { ADD_FILLED_FORM, DELETE_FILLED_FORM, FilledFormActions, JUMP_TO, NEXT_FORM_ITEM, PREV_FORM_ITEM, UPDATE_FORM_ANSWER } from "../actions";
import { FilledFormsState } from "../actions/types";
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

}
export function filledFormReducer(
    state = initialState,
    action: FilledFormActions
) {
    switch (action.type) {
        case ADD_FILLED_FORM:
            const { root, userId } = action.payload;
            if (!root) return state;
            let newForm: FilledForm = {
                completedDate: undefined,
                startedDate: new Date().getTime(),
                filledBy: userId,
                formId: root.id,
                id: getRandomId("filledform-"),
                cache_: new Map(),
                currentIndex: 0,

            };
            let newState = produce(state, draft => {
                draft[newForm.id] = newForm;
            })
            return newState;
        case DELETE_FILLED_FORM:
            return state;
      

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
            })()
        default:
            return state;
    }
}