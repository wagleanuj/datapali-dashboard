import { createSelector } from 'reselect';
import { $getFilledForms, $getFormId } from './shared';



export const getFilledFormById = createSelector([$getFilledForms, $getFormId],
    (filledForms, formId) => filledForms.byId[formId]);


export const getFIlledFormsTransformedData = createSelector([$getFilledForms],
    (filledForms) => {
      return   Object.keys(filledForms.byId).map(item => ({ title: item, startedDate: filledForms.byId[item].startedDate }))
    })
