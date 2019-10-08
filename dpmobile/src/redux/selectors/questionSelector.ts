import { RootSection } from 'dpform';
import { AppState } from "react-native";
import { createSelector } from 'reselect';
import { Helper } from "../helper";

const $getRootForm = (state, props) => {
    return state.availableForms;
}
const $getRootFormId = (state: AppState, props) => {
    return props.rootId;
}
const $getQuestionId = (state, props) => props.questionId;
const $getFilledForms = (state, props) => state.filledForms;
const $getFilledFormId = (state, props) => props.formId;
const $getPathForQuestion = (state, props) => props.path;

export const getQuestionsForForm = createSelector([$getRootForm, $getRootFormId],
    (rootForms, rootId) => {
        return rootForms[rootId]
    }
)

export const getQuestionById = createSelector([getQuestionsForForm, $getQuestionId],
    (root: RootSection, questionId: string) => root.questions[questionId]);

export const getQuestionOptions = createSelector([getQuestionById], (question) => question.options);

export const getSortedOptions = createSelector([getQuestionOptions],
    (options) => {
        return options.SortedOptions;
    });

export const getDependenciesOfOptions = createSelector([getSortedOptions], (options => {
    const { groups, rootOptions } = options;
    let dependencies: string[] = [];
    groups.forEach(item => {
        dependencies = dependencies.concat(item.appearingCondition.literals.map(item => item.questionRef));
    });
    rootOptions.forEach(item => {
        dependencies = dependencies.concat(item.appearingCondition.literals.map(item => item.questionRef));
    })
    return dependencies;
}));



export const getQuestionTitle = createSelector([getQuestionById],
    (question) => question.questionContent.content);

export const getQuestionType = createSelector([getQuestionById],
    (question) => question.answerType);




export const getFilledFormById = createSelector([$getFilledForms, $getFilledFormId],
    (filledForms, id) => filledForms[id]);

export const getCacheForFilledForm = createSelector([getFilledFormById], (filledform => filledform.cache_));
export const getDependencyValues = createSelector([getDependenciesOfOptions, getCacheForFilledForm], (dependencies, cache) => {
    const ret = {};
    dependencies.forEach(id => {
        const m = cache.get(id);
        if (!m) {
            ret[id] = undefined;
            return;
        }
        const v = m.entries().next();
        if (!v) {
            ret[id] = undefined;
        }
        ret[id] = v.value[1];
    });
    return ret;
});

export const getValidOptions = createSelector([getSortedOptions, getDependencyValues, getQuestionsForForm],
    (options, vals, questions) => {
        const { groups, rootOptions } = options;
        let g = groups.filter(item => Helper.evaluateCondition(item.appearingCondition, vals, questions.questions));
        let o = rootOptions.filter(item => Helper.evaluateCondition(item.appearingCondition, vals, questions.questions));
        return {
            groups: g,
            rootOptions: o
        }
    });
export const getTransformedValidOptions = createSelector([getValidOptions], options => {
    const { groups, rootOptions } = options;
    let allOptions: { id: string, text: string }[] = []
    groups.forEach(item => {
        return item.members.forEach(option => {
            allOptions.push({ id: option.id, text: option.value });
        });
    });
    rootOptions.forEach(option => {
        allOptions.push({ id: option.id, text: option.value });
    });
    return allOptions;
});

export const getAnswerSectionForFilledForm = createSelector([getFilledFormById],
    (form) => form.answerSection);
export const getAnswerAtPath = createSelector([getAnswerSectionForFilledForm, $getPathForQuestion],
    (answerSection, path) => {
        const val = Helper.getAnswerSectionItemFromPath(answerSection, path);
        return val
    });


export const getAnswerValueAtPath = createSelector([getAnswerAtPath],
    (answer) => {
        return answer.answer
    })


