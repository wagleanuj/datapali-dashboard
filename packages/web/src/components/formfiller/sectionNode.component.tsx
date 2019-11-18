import { Tabs } from "antd";
import React, { useContext } from "react";
import { FormRenderContext } from "./formviewer.component";
import { QuestionNode } from "./questionNode.component";
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
}

const getChild = (props: ChildProps) => {
    const { formId, rootId, typeChecker, path, locationName, id, index, iteration, hideIterationInPath } = props;
    const newPath = hideIterationInPath ? path.concat(index) : path.concat(iteration, index);
    const newLocation = locationName.concat(`[${iteration}].${id}`);
    if (typeChecker(id) === "section") {
        return (
            <ConnectedSectionNode formId={formId} rootId={rootId} key={newLocation} id={id} path={newPath} locationName={newLocation} />
        )
    } else {
        return (
            <QuestionNode id={id} path={newPath} locationName={newLocation} />
        )
    }
}

const getChildren = (formId: string, rootId: string, typeChecker: (id: string) => "section" | "root" | "question", path: number[], locationName: string, childNodes: string[], iteration: number, hideIterationInPath: boolean = true) => {
    return childNodes.map((id, index) => getChild({ formId, rootId, typeChecker, path, locationName, id, index, iteration, hideIterationInPath }));
}

const getTabbedView = (formId: string, rootId: string, typeChecker: (id: string) => "section" | "root" | "question", duplicateTimes: number, childNodes: string[], path: number[], locationName: string) => {
    return <Tabs defaultActiveKey={"0"} tabPosition="top">
        {[...Array(duplicateTimes).keys()].map(i => (
            <Tabs.TabPane tab={`Record-${i}`} key={i.toString()}>
                {getChildren(formId, rootId, typeChecker, path, locationName, childNodes, i, false)}
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
    typeChecker?: (id: string) => "section" | "root" | "question";
}
export function SectionNode(props: SectionNodeProps) {
    const renderContext = useContext(FormRenderContext);
    const decisiveRender = (duplicateTimes: number) => {
        if (duplicateTimes !== -1) {
            return duplicateTimes === 0 ? <NotRequiredSectionPage /> : getTabbedView(props.rootId, props.formId, props.typeChecker, duplicateTimes, props.childNodes, props.path, props.locationName);
        }
        return getChildren(props.rootId, props.formId, props.typeChecker, props.path, props.locationName, props.childNodes, 0, true);
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