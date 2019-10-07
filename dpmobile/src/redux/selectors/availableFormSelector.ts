import { RootSection } from 'dpform';
import _ from 'lodash';
import { createSelector } from 'reselect';


const GET_AVAILABLE_FORMS = (state, props) => {
    return state.availableForms;
}
export const getAvailableRootForm = createSelector([GET_AVAILABLE_FORMS],
    (availableForms) => availableForms)



export const getAvailableForms = (formIds: string[]) => {
    return createSelector(
        [GET_AVAILABLE_FORMS],
        (availableForms) => _.pickBy(availableForms, (v: RootSection, k: string) => {
            if (formIds.includes(k)) return true;
            return false;
        })
    )
}

//filters todo::