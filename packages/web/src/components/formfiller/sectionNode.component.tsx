import { Tabs } from "antd";
import React, { ReactNode, useContext } from "react";
import { QuestionNode } from "./questionNode.component";
import { FormRenderContext } from "./section.component";

type ChildProps = {
    typeChecker: (id: string) => "section" | "root" | "question",
    path: number[],
    locationName: string,
    id: string,
    index: number,
    iteration: number,
    hideIterationInPath: boolean,
}
const getChild = (props: ChildProps) => {
    const { typeChecker, path, locationName, id, index, iteration, hideIterationInPath } = props;
    const newPath = hideIterationInPath ? path.concat(index) : path.concat(iteration, index);
    const newLocation = locationName.concat(`[${iteration}].${id}`);
    if (typeChecker(id) === "section") {
        return (
            <SectionNode key={newLocation} id={id} path={newPath} locationName={newLocation} renderSectionHeader={props.renderSectionHeader} />
        )
    } else {
        return (
            <QuestionNode id={id} path={newPath} locationName={newLocation} />
        )
    }
}

const getChildren = (typeChecker: (id: string) => "section" | "root" | "question", path: number[], locationName: string, childNodes: string[], iteration: number, hideIterationInPath: boolean = true) => {
    return childNodes.map((id, index) => getChild({ typeChecker, path, locationName, id, index, iteration, hideIterationInPath }));
}

const getTabbedView = (typeChecker: (id: string) => "section" | "root" | "question", duplicateTimes: number, childNodes: string[], path: number[], locationName: string) => {
    return <Tabs defaultActiveKey={"0"} tabPosition="top">
        {[...Array(duplicateTimes).keys()].map(i => (
            <Tabs.TabPane tab={`Record-${i}`} key={i.toString()}>
                {getChildren(typeChecker, path, locationName, childNodes, i, false)}
            </Tabs.TabPane>
        ))}
    </Tabs>
}

type SectionNodeProps = {
    id: string;
    childNodes?: string[];
    name?: string;
    locationName: string;
    duplicateTimes?: number;
    path: number[];
    renderSectionHeader: (sectionName: string, path: number[]) => ReactNode;
    typeChecker?: (id: string) => "section" | "root" | "question";
}
export function SectionNode(props: SectionNodeProps) {
    const renderContext = useContext(FormRenderContext);
    const decisiveRender = (duplicateTimes: number) => {
        if (duplicateTimes !== -1) {
            return duplicateTimes === 0 ? <NotRequiredSectionPage /> : getTabbedView(props.typeChecker, duplicateTimes, props.childNodes, props.path, props.locationName);
        }
        return getChildren(props.typeChecker, props.path, props.locationName, props.childNodes, 0, true);
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