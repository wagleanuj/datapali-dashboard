import React, { useContext } from "react";
import { Field } from "redux-form";
import { FormRenderContext } from "./formviewer.component";
import { IQuestionRenderProps } from "./questionNode.container";
import { IQuestion } from "./types";


type QuestionNodeProps = {
    locationName: string;
    path: number[];
    question?: IQuestion;
    id: string;

} & IQuestionRenderProps;


export function QuestionNode(props: QuestionNodeProps) {
    const renderContext = useContext(FormRenderContext);

    const { isRequired, autoCompleteData, options, type, dependencies, title, path } = props;
    return (
        <Field
            key={'field' + props.locationName}
            name={props.locationName}
            props={{
                isRequired,
                autoCompleteData,
                options,
                type,
                dependencies,
                title,
                path

            }}

            component={renderContext.renderQuestion}
        />
    )
}

