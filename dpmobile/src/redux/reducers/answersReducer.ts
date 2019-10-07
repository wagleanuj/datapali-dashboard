import { AnswerState } from "../actions/types";
import { AnswerActionTypes, UPDATE_ANSWER } from "../actions";

const initialState: AnswerState = {
    answers: new Map()
}
export function answerReducer(
    state = initialState,
    action: AnswerActionTypes
): AnswerState {
    switch (action.type) {
        case UPDATE_ANSWER:
            const newAnswers = new Map(state.answers);
            const { path, questionId, value } = action.payload;
            if (!newAnswers.has(questionId)) {
                newAnswers.set(questionId, new Map());
            }
            newAnswers.get(questionId).set(path.join("."), value);
            return {
                answers: newAnswers
            }
        default:
            return state;
    }
}