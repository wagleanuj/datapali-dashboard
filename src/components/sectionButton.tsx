import { Badge } from "reactstrap";

import React from "react";
import { ButtonGroup, Button } from "@blueprintjs/core";

interface SectionButtonProps {
    sectionId: string,
    onClick: (id: string, path: number[]) => void,
    path: number[],
    readablePath: string,
    handleDeletion: (id: string, path: number[]) => void

}
export const SectionButton = (props: SectionButtonProps) => {
    return (
        <ButtonGroup className="bp3-dark" style={{ paddingBottom: "20px" }} fill >
            <Button style={{ height: 50 }} alignText="left" onClick={() => props.onClick(props.sectionId, props.path)} rightIcon={"folder-open"}><Badge color="secondary">S</Badge> <span>{props.readablePath + " Section"} </span></Button>
            <Button onClick={() => props.handleDeletion(props.sectionId, props.path)} style={{ height: 50, width: 20 }} alignText="left" rightIcon={"cross"} />
        </ButtonGroup>
    )
}