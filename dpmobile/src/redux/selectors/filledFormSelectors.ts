import { createSelector } from 'reselect';
import { Helper } from '../helper';
import { getCacheForFilledForm, getRootFormById } from './questionSelector';


const $getFilledForms = (state, props) => {
    return state.filledForms;
}

const $getFormId = (state, props, formId) => props.formId || formId;

export const getFilledFormById = createSelector([$getFilledForms, $getFormId],
    (filledForms, formId) => filledForms[formId]);

export const getFilledFormsState = createSelector([$getFilledForms],
    (filledForms) => filledForms
);

export const getCurrentIndex = createSelector([$getFilledForms, $getFormId],
    (filledForms, formId) => filledForms[formId].currentIndex);

export const getCurrentFilledFormContent = createSelector([$getFilledForms, $getFormId],
    (filledForms, formId) => {
        let filledForm = filledForms[formId];
        let index = filledForm.currentIndex || 0;
        return filledForm.answerSection.content[0][index];
    });

export const getPageContent = createSelector([getRootFormById, getCacheForFilledForm, getCurrentIndex], (rf, c, index, ) => {
    const result = Helper.buildContent2(rf, [], c);
    return result.content[0][index];
})
export const getFIlledFormsTransformedData = createSelector([$getFilledForms],
    (filledForms) => Object.keys(filledForms).map(item => ({ title: filledForms[item].id, startedDate: filledForms[item].startedDate })))
