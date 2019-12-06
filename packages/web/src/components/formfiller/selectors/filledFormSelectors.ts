import { createSelector } from 'reselect';
import { $getFilledForms, $getFormId } from './shared';



export const getFilledFormById = createSelector([$getFilledForms, $getFormId],
  (filledForms, formId) => filledForms.byId[formId]);


