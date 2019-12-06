import { ANSWER_TYPES, IValueType } from "@datapali/dpform";
import { connect } from "react-redux";
import { Helper, IDependency } from "../../helper";
import { IAppState } from "../../types";
import { QuestionNode } from "./questionNode.component";
import { getNodeOfRootForm } from "./selectors/nodeSelector";
import { getAutoCompleteDataForQuestion, getTransformedValidOptions } from "./selectors/questionSelector";

export interface IQuestionRenderProps {
    isRequired?: boolean,
    autoCompleteData?: { strength: number, text: string }[],
    dependencies?: IDependency,
    title?: string,
    type?: IValueType,
    options?: { id: string, text: string }[],
    path: number[];
}

const mapStateToProps = (state: IAppState, props: any) => {
    const all = getNodeOfRootForm(state, props);
    const type = all.answerType;
    const title = all.questionContent.content;
    const deps = Helper.collectDependencies(all);
    return {
        isRequired: all.isRequired,
        autoCompleteData: getAutoCompleteDataForQuestion(state, props),
        isDependent: deps.all.length > 0,
        dependencies: deps,
        title: title,
        type: type,
        options: type.name === ANSWER_TYPES.SELECT ? getTransformedValidOptions(state, props) : [],

    }

}

export const ConnectedQuestionNode = connect(mapStateToProps, null)(QuestionNode);