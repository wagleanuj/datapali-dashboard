import { IDupeSettings, RootSection } from 'dpform';
import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { AppState } from "react-native";
import { getFormValues } from 'redux-form';
import { createSelector } from 'reselect';
import { AutoCompleteItem } from '../../components/reduxFormComponents/surveyformitem';
import { Helper } from "../helper";
const $getRootForm = (state, props) => {
    return state.rootForms;
}
const $getRootFormId = (state: AppState, props) => {
    return props.rootId;
}
const $getQuestionId = (state, props) => props.questionId;
const $getFilledForms = (state, props) => state.filledForms;
const $getFilledFormId = (state, props) => props.formId;
const $getPathForQuestion = (state, props) => props.path;
const $getProps = (state, props) => props;
const $getState = (state, props) => state;
const $getSectionId = (state, props) => props.sectionId;
const $getValueLocationName = (state, props) => props.valueLocationName;

export const getRootFormById = createSelector([$getRootForm, $getRootFormId],
    (rootForms, rootId) => {
        return rootForms[rootId]
    }
);
export const getRootFormQuestions = createSelector([getRootFormById],
    root => root.questions);

export const getRootFormSection = createSelector([getRootFormById],
    (root) => root.sections);
export const getRootFormSectionById = createSelector([getRootFormSection, $getSectionId], (sections, sectionId) => sections[sectionId]);
export const getDuplicatingSettingsForSection = createSelector([getRootFormSectionById],
    (section) => section.duplicatingSetings);

export const getDuplicatingSettingsValueForSection = createSelector([getDuplicatingSettingsForSection, $getState, $getProps],
    (dupe: IDupeSettings, state, props) => {
        if (!dupe.isEnabled) return undefined;
        if (dupe.duplicateTimes.type === 'number') {
            return parseInt(dupe.duplicateTimes.value);
        }
        const ref = dupe.duplicateTimes.value;
        if (!ref) return undefined;
        let cache = getCacheForFilledForm(state, props);
        const m = cache.get(ref);
        if (!m) {
            return undefined;
        }
        const v = m.entries().next();
        if (!v) {
            return undefined;
        }
        return parseInt(v.value[1]);

    });
export const getAllFilledFormIdsOfRootForm = createCachedSelector([$getRootFormId, $getFilledForms], (rid, filledForms) => {
    let bag = [];
    Object.values(filledForms).forEach(item => {
        if (item.formId === rid) {
            bag.push(item.id);
        }
    })
    return bag;
})(
    (state, props) => props.rootId
);

export const getFilledFormValues = createSelector([$getFilledFormId, $getState], (fid, state) => {
    return getFormValues(fid)(state);
});
export const getQuestionById = createSelector([getRootFormById, $getQuestionId],
    (root: any, questionId: string) => root[questionId]);

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
    });

    return Array.from(new Set(dependencies));
}));
export const getValuesOfDependencies = createSelector([$getValueLocationName, getDependenciesOfOptions, getFilledFormValues], (location, deps, vals) => {
    //for each deps , find the value that is closest to the path that it is asking from.
    let depValues = {};
    if (!vals) return depValues;
    let locationToPath = _.toPath(location);
    const checkForValue = (values, path, find) => {
        if (path.length === 0) return undefined;
        let newPath = path.slice(0);
        newPath.splice(path.length - 1, 1, find);
        let val = _.get(values, newPath);
        if (val) {
            return val;
        }
        newPath.splice(newPath.length - 1, 1);
        return checkForValue(values, newPath, find);
    }
    deps.forEach(dep => {
        let foundValue = checkForValue(vals, locationToPath, dep);
        if (foundValue) {
            depValues[dep] = foundValue;
        }
    });
    return depValues;

})


export const getQuestionTitle = createSelector([getQuestionById],
    (question) => question.questionContent.content);

export const getQuestionType = createSelector([getQuestionById],
    (question) => question.answerType);




export const getFilledFormById = createSelector([$getFilledForms, $getFilledFormId],
    (filledForms, id) => filledForms[id]);

export const getCacheForFilledForm = createSelector([getFilledFormById], (filledform => filledform.cache_));
// export const getDependencyValues = createSelector([getDependenciesOfOptions, getCacheForFilledForm], (dependencies, cache) => {
//     const ret = {};
//     dependencies.forEach(id => {
//         const m = cache.get(id);
//         if (!m) {
//             ret[id] = undefined;
//             return;
//         }
//         const v = m.entries().next();
//         if (!v) {
//             ret[id] = undefined;
//         }
//         ret[id] = v.value[1];
//     });
//     return ret;
// });

export const getValidOptions = createSelector([getSortedOptions, getValuesOfDependencies, getRootFormById],
    (options, vals, questions) => {
        console.log(questions);
        const { groups, rootOptions } = options;
        let g = groups.filter(item => Helper.evaluateCondition(item.appearingCondition, vals, questions.questions));
        let o = rootOptions.filter(item => Helper.evaluateCondition(item.appearingCondition, vals, questions.questions));
        return {
            groups: g,
            rootOptions: o
        }
    });

export const getSectionPageData = createSelector([$getState, getFilledFormById], () => {
    return {

    }
})
export const getTransformedValidOptions = createSelector(getValidOptions, options => {
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

export const getAutoCompleteDataForQuestion = createCachedSelector([$getValueLocationName, $getState, getAllFilledFormIdsOfRootForm], (location, state, fids) => {
    const values = [];
    fids.forEach(f => {
        values.push(getFormValues(f)(state))
    });
    let path = _.toPath(location);
    let result: { [key: string]: AutoCompleteItem } = {};
    values.forEach(v => {
        let res = _.get(v, path);
        if (res) {
            if (!result[res]) result[res] = { text: res, strength: 1 }
            else result[res].strength++;
        }

    });
    return Object.values(result).sort((a, b) => b.strength - a.strength);
})(
    (state, props) => props.valueLocationName
)



