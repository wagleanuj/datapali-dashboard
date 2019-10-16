import _ from 'lodash';
import createCachedSelector from 're-reselect';
import { getFormValues } from 'redux-form';
import { createSelector } from 'reselect';
import { AutoCompleteItem } from '../../components/reduxFormComponents/surveyformitem';
import { Helper } from "../helper";
import { $getFilledFormId, $getFilledForms, $getQuestionId, $getRootForm, $getRootFormId, $getSectionId, $getState, $getValueLocationName } from './shared';


export const getRootFormById = createSelector([$getRootForm, $getRootFormId],
    (rootForms, rootId) => {
        return rootForms.byId[rootId]
    }
);
export const getRootFormQuestions = createSelector([getRootFormById],
    root => root.questions);

export const getRootFormSection = createSelector([getRootFormById],
    (root) => root.sections);
export const getRootFormSectionById = createSelector([getRootFormSection, $getSectionId], (sections, sectionId) => sections[sectionId]);
export const getDuplicatingSettingsForSection = createSelector([getRootFormSectionById],
    (section) => section.duplicatingSetings);


export const getAllFilledFormIdsOfRootForm = createCachedSelector([$getRootFormId, $getFilledForms], (rid, filledForms) => {
    let bag = [];
    Object.values(filledForms.byId).forEach(item => {
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
        return {
            rootOptions: Object.values(options.optionsMap).filter(item => !item.groupName),
            groups: Object.values(options.optionGroupMap),
        }
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





export const getValidOptions = createSelector([getSortedOptions, getValuesOfDependencies, getRootFormById],
    (options, vals, questions) => {
        const { groups, rootOptions } = options;
        let g = groups.filter(item => Helper.evaluateCondition(item.appearingCondition, vals, questions));
        let o = rootOptions.filter(item => Helper.evaluateCondition(item.appearingCondition, vals, questions));
        return {
            groups: g,
            rootOptions: o
        }
    });


export const getTransformedValidOptions = createSelector(getValidOptions, options => {
    const { groups, rootOptions } = options;
    let allOptions: { id: string, text: string }[] = [];
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



