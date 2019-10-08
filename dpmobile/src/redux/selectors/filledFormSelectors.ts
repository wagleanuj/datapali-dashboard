import { createSelector } from 'reselect';
import { RootSection, QuestionSection, QAQuestion } from 'dpform';
import { getRootFormById, getCacheForFilledForm } from './questionSelector';
import { Helper } from '../helper';


const $getFilledForms = (state, props) => {
    return state.filledForms;
}

const $getFormId = (state, props, formId) => props.formId ||formId;

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

export const getPageContent = createSelector([getRootFormById,getCacheForFilledForm,getCurrentIndex],(rf,c, index,)=>{
    const result =  Helper.buildContent2(rf,[],c );
    return result.content[0][index];
})
export const getFIlledFormsTransformedData = createSelector([$getFilledForms],
    (filledForms) => Object.keys(filledForms).map(item => ({ title: filledForms[item].id, startedDate: filledForms[item].startedDate })))

//filters todo::
function getValueFromAnswerCache(cache: Map<string, Map<string, string>>, ref: string) {
    const m = cache.get(ref);
    if (!m) {
        return undefined;
    }
    const v = m.entries().next();
    if (!v) {
        return undefined;
    }
}
function makeData(root: RootSection|QuestionSection, answerCache: Map<string, Map<string, string>>) {
    let allItems = [];
    root.content.forEach(item => {
        if (item instanceof QuestionSection) {
            let placeholder = [];
            let times = 0;
            if (item.duplicatingSettings.isEnabled) {
                if (item.duplicatingSettings.duplicateTimes.type === 'number') {
                    times = parseInt(item.duplicatingSettings.duplicateTimes.value);
                } else {
                    let val = getValueFromAnswerCache(answerCache, item.duplicatingSettings.duplicateTimes.value);
                    if (val) times = parseInt(val);
                }
            }
            if (times !== 0) {
                for (let i = 0; i < times; i++) {
                    placeholder.push(makeData(item,answerCache))//todoooo;;;
                }
            }


        } else if (item instanceof QAQuestion) {
            allItems.push()
        }
    })
}