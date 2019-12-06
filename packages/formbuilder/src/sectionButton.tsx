import { Alignment, Button, ButtonGroup, Collapse, EditableText, H5, Navbar } from "@blueprintjs/core";
import React, { ReactNode, useState } from "react";


interface SectionButtonProps {
    sectionId: string;
    onClick: (id: string, path: number[]) => void;
    path: number[];
    readablePath: string;
    handleDeletion: (id: string, path: number[]) => void;
    handleMoveUp: (id: string, path: number[]) => void;
    children: ReactNode;
    handleSectionNameChange: (v: string) => void;
    handleOpenConditionSettings: () => void;
    handleCustomIdChange: (v: string)=>void;
    sectionName: string;
    customId: string;

}
export const SectionButton = (props: SectionButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <ButtonGroup  style={{ paddingBottom: "20px" }} fill vertical>
            <ButtonGroup>
                <Button style={{ width: 20 }} icon="arrow-up" onClick={() => props.handleMoveUp(props.sectionId, props.path)} />

                <Navbar>
                    <Navbar.Group align={Alignment.LEFT}>
                        <H5>
                            <span>{props.readablePath} </span>
                            <EditableText onChange={props.handleSectionNameChange} placeholder="Section" defaultValue={props.sectionName}> </EditableText>
                        </H5>
                    </Navbar.Group>
                    <Navbar.Group align={Alignment.RIGHT}>
                        <EditableText onChange={props.handleCustomIdChange} placeholder="Custom Id" defaultValue={props.customId}> </EditableText>

                        <Button icon="key" onClick={() => props.handleOpenConditionSettings()}></Button>

                        <Button onClick={() => setIsExpanded(!isExpanded)} icon="cog"></Button>
                        <Button icon="folder-open" onClick={() => props.onClick(props.sectionId, props.path)}></Button>
                    </Navbar.Group>
                </Navbar>
                <Button style={{ width: 20 }} icon="cross" onClick={() => props.handleDeletion(props.sectionId, props.path)} />
            </ButtonGroup>

            <Collapse isOpen={isExpanded} keepChildrenMounted={false}>
                {props.children}
            </Collapse>

        </ButtonGroup>
    )
}