import { createSelector } from 'reselect';
import { $getFilledForms, $getFormId, $getState } from './shared';
import { getValidQuestionsNumber } from './nodeSelector';



export const getFilledFormById = createSelector([$getFilledForms, $getFormId],
  (filledForms, formId) => filledForms.byId[formId]);


