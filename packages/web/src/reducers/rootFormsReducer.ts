import produce from "immer";
import { ADD_ITEM_TO_ROOT_FORM, ADD_ROOT_FORM, DELETE_ITEM_IN_ROOT_FORM, DELETE_ROOT_FORM, MOVE_ITEM_IN_ROOT_FORM, REPLACE_ROOT_FORMS, RootFormActions } from "../actions";
import { IRootFormsState } from "../types";
const has = Object.prototype.hasOwnProperty;
export const initialRootFormsState: IRootFormsState = {
    byId: {},
    ids: []
}
export function rootFormsReducer(
    state = initialRootFormsState,
    action: RootFormActions
): IRootFormsState {
    switch (action.type) {
        case ADD_ROOT_FORM:
            return produce(state, draft => {
                const payload = action.payload;
                if (!draft.ids.includes(payload.id)) {
                    draft.ids.push(payload.id)
                }
                draft.byId[payload.id] = payload.root;
            });
        case ADD_ITEM_TO_ROOT_FORM:
            const rootItem = state.byId[action.payload.rootId];
            //do the update 

            const newItem = {
                ...rootItem,

            }
            if (rootItem) {
                const newItem = produce(rootItem, draft => {
                    const { item, parentId, rootId } = action.payload;
                    draft[item.id] = item;
                    //@ts-ignore
                    draft[parentId].childNodes.push(item.id);
                });
                return {
                    ...state,
                    byId: {
                        ...state.byId,
                        [action.payload.rootId]: newItem
                    }
                }
            }

            return state;



        case DELETE_ITEM_IN_ROOT_FORM:
            return produce(state, draft => {
                const { rootId, itemId, parentId } = action.payload;
                const root = draft.byId[rootId];
                if (!root) throw new Error("Could not find the root");
                delete root[itemId];
                //@ts-ignore
                const childNodes: string[] = root[parentId].childNodes.slice(0);
                const index = childNodes.findIndex(item => item === itemId);
                childNodes.splice(0, index);
                //@ts-ignore
                root[parentId].childNodes = childNodes;
            });

        case MOVE_ITEM_IN_ROOT_FORM:
            return produce(state, draft => {
                const { rootId, itemId, parentId, newParentId } = action.payload;
                const root = draft.byId[rootId];

                if (!root) throw new Error("Could not find the root");
                //@ts-ignore
                const childNodes: string[] = root[parentId].childNodes.slice(0);
                const index = childNodes.findIndex(item => item === itemId);
                childNodes.splice(0, index);
                //@ts-ignore
                root[parentId].childNodes = childNodes;

                //perform the move operation 
                const newParent = root[newParentId];
                //@ts-ignore
                newParent.childNodes.push(itemId);
            })

        case REPLACE_ROOT_FORMS:
            const payload = action.payload;
            return { ...state, byId: payload.roots, ids: Object.keys(payload) };
        case DELETE_ROOT_FORM:
            return state;

        default:
            return state;
    }
}