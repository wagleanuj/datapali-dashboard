import { Button, ButtonGroup, Collapse } from "@blueprintjs/core";
import React, { ReactNode, useState } from "react";


interface QuestionButtonProps {
    questionId: string,
    questionTitle: string,
    isExpanded: boolean,
    children: ReactNode,
    path: number[],
    readablePath: string,
    handleDeletion: (id: string, path_: number[]) => void,
    handleMoveUp: (id: string, path_: number[]) => void,
}

export const QuestionButton = (props: QuestionButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <ButtonGroup  style={{ paddingBottom: "20px" }} fill vertical>
            <ButtonGroup>
                <Button onClick={() => props.handleMoveUp(props.questionId, props.path)} style={{ height: 50, width: 20 }} icon={"arrow-up"} />

                <Button style={{ height: 50 }} onClick={() => setIsExpanded(!isExpanded)} alignText={"left"} rightIcon={isExpanded ? "chevron-up" : "chevron-down"}>Q <span>{props.readablePath} </span> <span> {props.questionTitle} </span></Button>
                <Button onClick={() => props.handleDeletion(props.questionId, props.path)} style={{ height: 50, width: 20 }} alignText="left" rightIcon={"cross"} />
            </ButtonGroup>
            <Collapse keepChildrenMounted={false} isOpen={isExpanded}>
                {props.children}
            </Collapse>
        </ButtonGroup>
    )
}



