import { QuestionSection, RootSection } from "@datapali/dpform";
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { WrappedFieldProps } from "redux-form";
import { IQuestionRenderProps } from "./questionNode.container";
import { ConnectedSectionNode } from "./sectionNode.container";
import { IQuestion, IRootSection, ISection } from "./types";

type FormTree = { [key: string]: IRootSection | ISection | IQuestion }
export function makeTree(root: RootSection | QuestionSection, tree: FormTree = {}) {
    const type = root instanceof QuestionSection ? 'section' : 'root';
    const val: IRootSection | ISection = {
        ...root,
        _type: type,
        childNodes: []
    };
    for (let i = 0; i < root.content.length; i++) {
        let item = root.content[i];
        if (item instanceof QuestionSection) {
            val.childNodes.push(item.id);
            makeTree(item, tree);
        } else {
            val.childNodes.push(item.id);
            const question: IQuestion = { ...item, _type: 'question' };
            tree[item.id] = question;
        }
    }
    tree[root.id] = val;

    return tree;
}

type FormViewerProps = {
    renderSectionHeader: (sectionName: string, path: number[]) => ReactNode;
    renderQuestion: (question: IQuestionRenderProps, path: number[], fieldProps: WrappedFieldProps) => ReactNode;
}
type FormViewerState = {

}
export function FormViewer(props: FormViewerProps) {
    const params = new URLSearchParams(useLocation().search);
    const rootId = params.get("rootId");
    const formId = params.get("formId");
    return (<FormRenderContext.Provider
        value={
            {
                renderQuestion: props.renderQuestion,
                renderSectionHeader: props.renderSectionHeader,
            }
        }
    >
        <ConnectedSectionNode id={rootId} formId={formId} path={[]} locationName={rootId} />

    </FormRenderContext.Provider>

    )

}

//load the filledform from database
//create rootform
//create filledform
//initialize values



export type RenderQuestionProps = {
    question: {

    }
}
export type RenderContextType = {
    renderSectionHeader: (sectionName: string, path: number[]) => ReactNode;
    renderQuestion: (question: IQuestionRenderProps, path: number[], fieldProps: WrappedFieldProps) => ReactNode;
}
export const FormRenderContext = React.createContext<RenderContextType>({
    renderSectionHeader: (sectionName: string, path: number[]) => null,
    renderQuestion: () => null,
});

