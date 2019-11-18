import { IDupeSettings } from "@datapali/dpform";
import _ from "lodash";
import { IFilledForm } from "packages/web/src/types";
import { getFormValues } from "redux-form";
import { createSelector } from "reselect";
import { Helper } from "../../../helper";
import { getFilledFormById } from "./filledFormSelectors";
import { getFilledFormValues } from "./questionSelector";
import { $getFilledForms, $getNodeId, $getRootForm, $getRootFormId, $getState, $getValueLocationName } from "./shared";

export const getRootFormOfFilledForm = createSelector([getFilledFormById, $getRootForm], (filledForm: IFilledForm, rootForms) => {
    const rootId = filledForm.formId;
    return rootForms.byId[rootId];
});

export const getNodeOfRootForm = createSelector([getRootFormOfFilledForm, $getNodeId], (root, nodeId) => {
    return root[nodeId]
});
export const getNodeTypeFromId = createSelector([getNodeOfRootForm], (node) => node._type);

export const getSectionNameFromId = createSelector([getNodeOfRootForm], (node) => node.name);
export const getChildrenOfSectionFromId = createSelector([getNodeOfRootForm], (node) => node.childNodes);

export const getRootNodeOfFilledFormById = createSelector([getFilledFormById, getRootFormOfFilledForm], (ff, rootForm) => {
    const rootId = ff.formId;
    return rootForm[rootId];
});
export const getRootNodeChildren = createSelector([getRootNodeOfFilledFormById], (rootNode) => rootNode.childNodes)

export const getDupeSettingsForSectionNode = createSelector([getNodeOfRootForm], (node) => {
    return node.duplicatingSettings;
});

export const getDupeTimesForSectionNode = createSelector([getDupeSettingsForSectionNode, $getValueLocationName, getFilledFormValues], (settings: IDupeSettings, location: string, values: any) => {
    if (!settings.isEnabled) return -1;
    else {
        let times = settings.duplicateTimes;

        if (times.type === 'number') {
            return parseInt(times.value);
        }
        else {
            let ref = times.value;

            let value = findValue(values, ref);
            if (value) {
                return parseInt(value)
            } else {
                return 0;
            }

        }
    }
})
export const getValidQuestionsNumber = createSelector([getRootFormOfFilledForm, getFilledFormValues, $getRootFormId], (root, values, rid) => {
    const count = {}
    checkSection(root[rid], values, root, "", count, true);
    return count;
});




export const getFilledFormsTransformedData = createSelector([$getFilledForms, $getState, $getRootForm],
    (filledForms, state, rootForms) => {
        return Object.keys(filledForms.byId).map(item => {
            const rootId = filledForms.byId[item].formId;
            const values = getFormValues(item)(state);
            const formName = rootForms.byId[rootId].name;
            return {
                formId: item,
                rootId: rootId,
                startedDate: filledForms.byId[item].startedDate,
                count: getValidQuestionsNumber(state, { formId: item, rootId: rootId }),
                submitted: filledForms.byId[item].submitted,
                values: values,
                formName: formName || "Main Form",
            }
        })
    })


function findValue(values, ref) {
    if (!values) return undefined;
    let keys = Object.keys(values);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let curr = values[key];
        if (Array.isArray(curr)) {
            let val = findValue(curr[curr.length - 1], ref);
            if (val) return val;
        } else {
            if (key === ref) {
                return curr;
            }
        }
    }
    return undefined;
}

function checkSection(section, values, root, sectionLocation, counts: any = {}, isRoot: boolean = false) {
    const appears = section.appearingCondition ? Helper.evaluateCondition(section.appearingCondition, values, root) : true;
    if (!counts[section.id]) counts[section.id] = { filled: 0, required: 0, unfilled: [], dupe: -1 }
    if (appears) {
        const dupe = Helper.getDupeTimes(section.duplicatingSettings, values);
        const dupeTimes = dupe === -1 ? 1 : dupe;
        counts[section.id].dupe = dupe;
        for (let i = 0; i < dupeTimes; i++) {
            section.childNodes.forEach((item, index) => {
                let location = isRoot ? [item] : _.toPath(sectionLocation).concat(i.toString(), item);
                if (root[item]._type === "question") {
                    const isRequired = !!root[item].isRequired;
                    if (isRequired) {
                        let isFilled = !!_.get(values, location);
                        if (isFilled) counts[section.id].filled++;
                        else {
                            counts[section.id].unfilled.push(location);
                        }
                        counts[section.id].required++;
                    }
                } else {
                    checkSection(root[item], values, root, location, counts)
                }
            })
        }
    }
}