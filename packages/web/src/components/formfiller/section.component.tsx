import { QuestionSection } from "@datapali/dpform";
import React from "react";

function makeTree(root: any, tree: any = {}) {
    tree[root.id] = { ...root, childNodes: [], _type: root instanceof QuestionSection ? 'section' : 'root' };
    tree[root.id].childNodes = [];
    for (let i = 0; i < tree[root.id].content.length; i++) {
        let item = tree[root.id].content[i];
        if (item.hasOwnProperty('content')) {
            makeTree(item, tree);
            tree[root.id].childNodes.push(item.id);
        } else {
            tree[item.id] = { ...item, _type: 'question' }
            tree[root.id].childNodes.push(item.id);
        }
    }
    delete tree[root.id].content;
    return tree;
}

type FormViewerProps = {
    formId: string;
    rootId: string;

}
type FormViewerState = {

}
export class FormViewer extends React.Component<FormViewerProps, FormViewerState>{
    state = {

    }
    init() {

    }

    render() {
        const children = 
        return (<></>)
    }
}