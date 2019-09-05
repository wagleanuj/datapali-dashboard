import { Badge } from "reactstrap";

import React, { ReactNode, useState } from "react";
import { ButtonGroup, Button, Collapse } from "@blueprintjs/core";

interface SectionButtonProps {
    sectionId: string,
    onClick: (id: string, path: number[]) => void,
    path: number[],
    readablePath: string,
    handleDeletion: (id: string, path: number[]) => void,
    children: ReactNode

}
export const SectionButton = (props: SectionButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <ButtonGroup className="bp3-dark" style={{ paddingBottom: "20px" }} fill  vertical>
            <ButtonGroup >
            <Button style={{ height: 50 }} alignText="left"  onClick={()=>setIsExpanded(!isExpanded)} onDoubleClick={() => props.onClick(props.sectionId, props.path)} rightIcon={isExpanded ? "chevron-up" : "chevron-down"}><Badge color="secondary">S</Badge> <span>{props.readablePath + " Section"} </span></Button>
            <Button  onClick={() => props.handleDeletion(props.sectionId, props.path)} style={{ height: 50, width: 20 }} alignText="left" rightIcon={"cross"} />
            </ButtonGroup>
            <Collapse isOpen ={isExpanded} keepChildrenMounted = {false}>
                {props.children}
            </Collapse>
        </ButtonGroup>
    )
}