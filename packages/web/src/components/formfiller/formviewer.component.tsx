import { QuestionSection, RootSection } from "@datapali/dpform";
import React, { ReactNode } from "react";
import { WrappedFieldProps } from "redux-form";
import { IQuestionRenderProps } from "./questionNode.container";
import { SectionNode } from "./sectionNode.component";
import { IQuestion, IRootSection, ISection } from "./types";

type FormTree = { [key: string]: IRootSection | ISection | IQuestion }
function makeTree(root: RootSection | QuestionSection, tree: FormTree = {}) {
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
    formId: string;
    rootId: string;
    tree: FormTree;
    renderSectionHeader: (sectionName: string, path: number[]) => ReactNode;
    renderQuestion: (question: IQuestionRenderProps, path: number[], fieldProps: WrappedFieldProps) => ReactNode;
}
type FormViewerState = {

}
export class FormViewer extends React.Component<FormViewerProps, FormViewerState>{
    state = {

    }
    init() {

    }

    renderSection(section: ISection) {

    }


    render() {
        const children = [];
        return (<FormRenderContext.Provider
            value={
                {
                    renderQuestion: this.props.renderQuestion,
                    renderSectionHeader: this.props.renderSectionHeader,
                }
            }
        >
            <SectionNode id={this.props.rootId} path={[]} locationName={this.props.rootId} />

        </FormRenderContext.Provider>

        )
    }
}
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

