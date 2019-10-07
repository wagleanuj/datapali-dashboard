import { JUMP, NEXT, PREV, SurveyActions } from "../actions";
import { SurveyState } from "../actions/types";
import { Helper } from "../helper";

const initialState: SurveyState = {
    answerStore: {
        answers: new Map()
    },
    content: [],
    history: [],
    currentIndex: 0,
    questionStore: new Map(),


}
export function SurveyReducer(
    state = initialState,
    action: SurveyActions
) {
    switch (action.type) {
        case NEXT:
            let i = state.currentIndex;
            const h = state.history.slice(0);
            for (let i = state.currentIndex + 1; i < state.content.length; i++) {
                let nextItem = state.content[i];
                if (nextItem) {
                    const isValid = Helper.evaluateCondition(nextItem.appearingCondition, state.answerStore, state.questionStore);
                    if (isValid) {
                        h.push(state.currentIndex);
                        break;
                    }
                }
            }
            return {
                ...state,
                history: h,
                currentIndex: i,
            }
        case PREV:
            if (state.history.length > -1) {
                const history = state.history.slice(0);
                const newItem = history.pop();
                return {
                    ...state,
                    history: history,
                    currentIndex: newItem
                }
            }
            return state;
        case JUMP:
            let newHistory = state.history.slice(0);
            const { index: newIndex } = action.payload;
            let currentIndex = state.currentIndex;
            const nextSection = state.content[newIndex];
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


        default:
            return state;
    }
}


