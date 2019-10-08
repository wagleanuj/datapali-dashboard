import { getRandomId } from "dpform";
import produce from "immer";
import { FilledForm } from "../../components/forms.component";
import { ADD_FILLED_FORM, DELETE_FILLED_FORM, FilledFormActions, JUMP_TO, NEXT_FORM_ITEM, PREV_FORM_ITEM, UPDATE_FORM_ANSWER } from "../actions";
import { FilledFormsState } from "../actions/types";
import { Helper } from "../helper";
const FilledFormItem: FilledForm = {
    answerSection: undefined,
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
                answerSection: Helper.buildContent(root),
                completedDate: undefined,
                startedDate: new Date().getTime(),
                filledBy: userId,
                formId: root.id,
                id: getRandomId("filledform-"),
                cache_: new Map()

            };
            let newState = produce(state, draft => {
                draft[newForm.id] = newForm;
            })
            return newState;
        case DELETE_FILLED_FORM:
            return state;
        case UPDATE_FORM_ANSWER:
            const ns = produce(state, draft => {
                const { formId, path, questionId, value } = action.payload;
                let itemFromPath = Helper.getAnswerSectionItemFromPath(draft[formId].answerSection, path);
                if (questionId === itemFromPath.questionId) {
                    itemFromPath.answer = value;
                    if (!draft[formId].cache_) draft[formId].cache_ = new Map();
                    let map = draft[formId].cache_;
                    let ansMap = map.get(questionId);
                    if (!ansMap) map.set(questionId, new Map());
                    ansMap = map.get(questionId);
                    ansMap.set(path.join('.'), value);
                }
            });
            return ns;

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
            return state;
        case NEXT_FORM_ITEM:
            return state;
        case PREV_FORM_ITEM:
            return state;
        default:
            return state;
    }
}