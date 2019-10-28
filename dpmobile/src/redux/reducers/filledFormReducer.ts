import { getRandomId } from "dpform";
import produce from "immer";
import _ from "lodash";
import { ADD_FILLED_FORM, DELETE_FILLED_FORM, FilledFormActions, MARK_AS_SUBMITTED, UPDATE_FILLED_FORMS } from "../actions";
import { FilledForm, FilledFormsState } from "../actions/types";
const FilledFormItem: FilledForm = {
    completedDate: undefined,
    filledBy: undefined,
    formId: undefined,
    id: undefined,
    startedDate: undefined,
    submitted: false,
}

const initialState: FilledFormsState = {
    byId: {},
    ids: []
}
export function filledFormReducer(
    state = initialState,
    action: FilledFormActions
) {
    switch (action.type) {
        case ADD_FILLED_FORM:
            const { rootId, userId } = action.payload;
            if (!rootId) return state;
            let newForm: FilledForm = {
                completedDate: undefined,
                startedDate: new Date().getTime(),
                filledBy: userId,
                formId: rootId,
                id: getRandomId("filledform-"),

            };
            let newState = produce(state, draft => {
                draft.byId[newForm.id] = newForm;
                draft.ids.push(newForm.id);
            })
            return newState;

        case UPDATE_FILLED_FORMS:
            const payload = _.cloneDeep(action.payload);
            return { ...state, byId: payload, ids: Object.keys(payload) };
        case DELETE_FILLED_FORM:
            return produce(state, draft => {
                const { formIds } = action.payload;
                formIds.forEach(id => {
                    delete draft.byId[id];
                    const index = draft.ids.findIndex(item => item === id);
                    if (index > -1) draft.ids.splice(index, 1);
                })

            })


        case MARK_AS_SUBMITTED:
            return produce(state, draft => {
                const { formIds } = action.payload;
                formIds.forEach(id => {
                    draft.byId[id].submitted = true;

                })
            })

        default:
            return state;
    }
}