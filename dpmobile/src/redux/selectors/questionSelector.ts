import { AppState } from "react-native";
import { createSelector } from 'reselect';
import { RootSection, QAQuestion } from 'dpform';

const $getRootForm = (state, props) => {
    return state.availableForms;
}
const $getRootFormId = (state: AppState, props) => {
    return props.rootId;
}
const $getQuestionId = (state, props) => props.questionId;

export const getQuestionsForForm = createSelector([$getRootForm, $getRootFormId],
    (rootForms, rootId) => {
        console.log(rootForms);
        return rootForms[rootId]
    }
)



export const getQuestionById = createSelector([getQuestionsForForm, $getQuestionId],
    (root: RootSection, questionId: string) => root.questions[questionId]);

export const getQuestionTitle = createSelector([getQuestionById],
    (question) => question.questionContent.content);

export const getQuestionType = createSelector([getQuestionById],
    (question) => question.answerType);

