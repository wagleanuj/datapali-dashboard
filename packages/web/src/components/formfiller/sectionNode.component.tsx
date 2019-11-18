import { Tabs } from "antd";
import React, { useContext } from "react";
import { FormRenderContext } from "./formviewer.component";
import { ConnectedQuestionNode } from "./questionNode.container";
import { ConnectedSectionNode } from "./sectionNode.container";

type ChildProps = {
    typeChecker: (id: string) => "section" | "root" | "question",
    path: number[],
    locationName: string,
    id: string,
    index: number,
    iteration: number,
    hideIterationInPath: boolean,
    formId: string,
    rootId: string,
    isInRootNode: boolean;
}

const getChild = (props: ChildProps) => {
    const { formId, rootId, typeChecker, path, locationName, id, index, iteration, hideIterationInPath, isInRootNode } = props;
    const newPath = hideIterationInPath ? path.concat(index) : path.concat(iteration, index);
    const newLocation = isInRootNode ? id : locationName.concat(`[${iteration}].${id}`);
    if (typeChecker(id) === "section") {
        return (
            <ConnectedSectionNode formId={formId} rootId={rootId} key={newLocation} id={id} path={newPath} locationName={newLocation} />
        )
    } else {
        return (
            <ConnectedQuestionNode key={newLocation} formId={formId} rootId={rootId} id={id} path={newPath} locationName={newLocation} />
        )
    }
}

const getChildren = (formId: string, rootId: string, typeChecker: (id: string) => "section" | "root" | "question", path: number[], locationName: string, childNodes: string[], iteration: number, hideIterationInPath: boolean = true, isInRootNode: boolean = false) => {
    return childNodes.map((id, index) => getChild({ formId, rootId, typeChecker, path, locationName, id, index, iteration, hideIterationInPath, isInRootNode }));
}

const getTabbedView = (formId: string, rootId: string, typeChecker: (id: string) => "section" | "root" | "question", duplicateTimes: number, childNodes: string[], path: number[], locationName: string, isInRootNode:boolean=false) => {
    return <Tabs defaultActiveKey={"0"} tabPosition="top">
        {[...Array(duplicateTimes).keys()].map(i => (
            <Tabs.TabPane tab={`Record-${i}`} key={i.toString()}>
                {getChildren(formId, rootId, typeChecker, path, locationName, childNodes, i, false, isInRootNode)}
            </Tabs.TabPane>
        ))}
    </Tabs>
}

type SectionNodeProps = {
    id: string;
    formId: string;
    rootId: string;
    childNodes?: string[];
    name?: string;
    locationName: string;
    duplicateTimes?: number;
    path: number[];
    isRootNode?: boolean;
    typeChecker?: (id: string) => "section" | "root" | "question";
}
export function SectionNode(props: SectionNodeProps) {
    const renderContext = useContext(FormRenderContext);
    const decisiveRender = (duplicateTimes: number) => {
        if (duplicateTimes !== -1) {
            return duplicateTimes === 0 ? <NotRequiredSectionPage key={'nr' + props.locationName} /> : getTabbedView(props.formId, props.rootId, props.typeChecker, duplicateTimes, props.childNodes, props.path, props.locationName, props.id===props.formId);
        }
        return getChildren(
            props.formId,
            props.rootId,
            props.typeChecker,
            props.path,
            props.locationName,
            props.childNodes,
            0,
            true,
            props.rootId===props.id
        );
    }
    return (
        <div>
            {renderContext.renderSectionHeader(props.name, props.path)}
            {decisiveRender(props.duplicateTimes)}
        </div>
    )
}
function NotRequiredSectionPage() {
    return (
        <>
            Not Required to Fill.
        </>
    )
}