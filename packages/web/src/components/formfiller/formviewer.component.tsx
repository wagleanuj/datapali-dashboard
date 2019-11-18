import { ApolloConsumer } from "@apollo/react-hooks";
import { QuestionSection, RootSection } from "@datapali/dpform";
import { Spin } from "antd";
import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";
import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router";
import { InjectedFormProps, WrappedFieldProps } from "redux-form";
import { IFilledForm, IRootForm } from "../../types";
import { IQuestionRenderProps } from "./questionNode.container";
import { ConnectedSectionNode } from "./sectionNode.container";
import { IQuestion, IRootSection, ISection } from "./types";


const GET_FILLED_FORM_BY_ID = gql`
query getFilled($ids: [String]!){
    getFilledFormById(ids:$ids){
      id
      formId
      answerStore
      completedDate
      filledBy
    }
  }`;
const GET_ROOT_FORM = gql`
query GetForm($id: [String]!){
    forms(id:$id){
      id
      content
      name
      
  
    }
  }
  `;
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

export type FormViewerProps = {
    filledForm?: IFilledForm;
    rootForm?: IRootForm;
    renderSectionHeader: (sectionName: string, path: number[]) => ReactNode;
    renderQuestion: (question: IQuestionRenderProps, path: number[], fieldProps: WrappedFieldProps) => ReactNode;
    handleFilledFormAdd?: (formId: string, filledForm: IFilledForm) => void;
    handleRootFormAdd?: (id: string, root: IRootForm) => void;
    initializeForm?: (formId: string, values: any) => void;
} & RouteComponentProps & InjectedFormProps;


export class FormViewer extends React.Component<FormViewerProps, any> {
    client: ApolloClient<any>;


    componentDidMount() {
        const props = this.props;
        const params = new URLSearchParams(this.props.location.search);
        const rootId = params.get("rootId");
        const formId = params.get("formId");
        Promise.all([this.client.query({
            query: GET_FILLED_FORM_BY_ID,
            variables: { ids: [formId] }
        }), this.client.query({
            query: GET_ROOT_FORM,
            variables: { id: [rootId] }
        })]).then(res => {
            const { data } = res[0];
            const { data: rData } = res[1];

            if (data.getFilledFormById[0] && rData.forms) {
                const rootForm = rData.forms[0];
                if (typeof (rootForm.content) === "string") rootForm.content = JSON.parse(rootForm.content);
                const rootSection = RootSection.fromJSON(rootForm);
                const formTree = makeTree(rootSection);
                props.handleRootFormAdd(rootId, formTree);

                const filledForm = data.getFilledFormById[0];
                if (typeof (filledForm.answerStore) === "string") filledForm.answerStore = JSON.parse(filledForm.answerStore);
                props.initializeForm(formId, filledForm.answerStore);

                const ff: IFilledForm = {
                    formId: filledForm.formId,
                    id: filledForm.id,
                    completedDate: filledForm.completedDate,
                    filledBy: filledForm.filledBy,
                    startedDate: filledForm.startedDate,

                }
                props.handleFilledFormAdd(formId, ff);

            }
        })


    }
    render() {
        const params = new URLSearchParams(this.props.location.search);
        const rootId = params.get("rootId");
        const formId = params.get("formId");
        const props = this.props;
        return (
            <ApolloConsumer>
                {client => {
                    this.client = client;
                    return (<FormRenderContext.Provider
                        value={
                            {
                                renderQuestion: props.renderQuestion,
                                renderSectionHeader: props.renderSectionHeader,
                            }
                        }
                    >
                        <Spin spinning={!props.filledForm || !props.rootForm}>
                            {props.filledForm && props.rootForm && <ConnectedSectionNode rootId={rootId} id={rootId} formId={formId} path={[]} locationName={rootId} />}
                        </Spin>

                    </FormRenderContext.Provider>
                    )
                }}
            </ApolloConsumer>


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

