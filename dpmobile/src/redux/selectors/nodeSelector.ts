import { IDupeSettings } from "dpform";
import _ from "lodash";
import { createSelector } from "reselect";
import { FilledForm } from "../actions/types";
import { getFilledFormById } from "./filledFormSelectors";
import { getFilledFormValues } from "./questionSelector";
import { $getNodeId, $getRootForm, $getValueLocationName } from "./shared";


export const getRootFormOfFilledForm = createSelector([getFilledFormById, $getRootForm], (filledForm: FilledForm, rootForms) => {
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

export const getDupeTimesForSectionNode = createSelector([getDupeSettingsForSectionNode, $getValueLocationName, getFilledFormValues], (settings: IDupeSettings, location: string, values) => {
    if (!settings.isEnabled) return -1;
    else {
        let times = settings.duplicateTimes;

        if (times.type === 'number') {
            return parseInt(times.value);
        }
        else {
            let ref = times.value;
            //get the value of the ref
            // let locationToPath = _.toPath(location);
            // const checkForValue = (values, path, find) => {
            //     if (path.length === 0) return undefined;
            //     if (path.length === 1) return _.get(values, [find]);
            //     let newPath = path.slice(0);
            //     newPath.splice(path.length - 1, 1, find);
            //     let val = _.get(values, newPath);
            //     if (val) {
            //         return val;
            //     }
            //     newPath.splice(newPath.length - 1, 1);
            //     return checkForValue(values, newPath, find);
            // }
            let value = findValue(values, ref);
            if (value) {
                return parseInt(value)
            } else {
                return 0;
            }

        }
    }
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