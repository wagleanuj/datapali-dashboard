import React, { useContext } from "react";
import { Field, WrappedFieldProps } from "redux-form";
import { FormRenderContext } from "./section.component";
import { IQuestion } from "./types";



type QuestionNodeProps = {
    locationName: string;
    path: number[];
    question?: IQuestion;
    id: string;
}
export function QuestionNode(props: QuestionNodeProps) {
    const renderContext = useContext(FormRenderContext);
    return (
        <Field
            name={props.locationName}
            component={(wp: WrappedFieldProps) => {
                return renderContext.renderQuestion(
                    props.question,
                    props.path,
                    wp
                );
            }}
        />
    )
}

