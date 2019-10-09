import { RootSection } from 'dpform';
import _ from 'lodash';
import { createSelector } from 'reselect';


const $getAvailableForms = (state, props) => {
    return state.availableForms;
}

const $getAvailableFormId = (state, formId) => formId;

export const getAllAvailableRootForms = createSelector([$getAvailableForms],
    (af) => af);

export const getAvailableRootForm = createSelector([$getAvailableForms, $getAvailableFormId],
    (availableForms, formId) => formId ? availableForms[formId] : availableForms)

export const getRootFormById = createSelector([$getAvailableForms, $getAvailableFormId],
    (availableForms, formId) => availableForms[formId])

export const getAvailableForms = (formIds: string[]) => {
    return createSelector(
        [$getAvailableForms],
        (availableForms) => _.pickBy(availableForms, (v: RootSection, k: string) => {
            if (formIds.includes(k)) return true;
            return false;
        })
    )
}

//filters todo::