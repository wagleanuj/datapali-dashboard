import React, { useContext } from "react";
import { Field, WrappedFieldProps } from "redux-form";
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
    const { isRequired, autoCompleteData, options, type, dependencies, title } = props;
    return (
        <Field
            name={props.locationName}
            component={(wp: WrappedFieldProps) => {

                return renderContext.renderQuestion(
                    {
                        isRequired,
                        autoCompleteData,
                        options,
                        type,
                        dependencies,
                        title,
                    },
                    props.path,
                    wp
                );
            }}
        />
    )
}

