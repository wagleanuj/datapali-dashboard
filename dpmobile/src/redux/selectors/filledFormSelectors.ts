import { createSelector } from 'reselect';
import _ from 'lodash';
import { FilledForm } from '../../components/forms.component';


const getFilledForms = (state, props) => {
    return state.filledForms;
}

export const getFilledFormsState = createSelector([getFilledForms],
    (filledForms) => filledForms
)

export const getFilledForm = (formIds: string[]) => {
    return createSelector(
        [getFilledForms],
        (filledForms) => _.pickBy(filledForms, (v: FilledForm, k: string) => {
            if (formIds.includes(k)) return true;
            return false;
        })
    )
}

//filters todo::