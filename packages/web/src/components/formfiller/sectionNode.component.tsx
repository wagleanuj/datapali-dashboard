import { Card, Empty, Tabs } from "antd";
import React, { useContext } from "react";
import { FormRenderContext } from "./formviewer.component";
import { ConnectedQuestionNode } from "./questionNode.container";
import { ConnectedSectionNode } from "./sectionNode.container";

type ChildProps = {
    typeChecker: (id: string) => "section" | "root" | "question",
    path: number[],
    locationName: string,
    id?: string,
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

const getChildren = (eachChildProp: ChildProps, childNodes: string[]) => {
    return childNodes.map((id, index) => getChild({ ...eachChildProp, index, id }));
}

const getTabbedView = (eachChildProp: ChildProps, childNodes: string[], duplicateTimes: number) => {
    return <Tabs defaultActiveKey={"0"} tabPosition="top">
        {[...Array(duplicateTimes).keys()].map(i => (
            <Tabs.TabPane tab={`Record-${i}`} key={i.toString()}>
                <div style={{ maxHeight: 580, overflow: "auto" }}>
                    {getChildren({
                        ...eachChildProp,
                        iteration: i,
                    }, childNodes)}
                </div>
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
        const eachChildProp: ChildProps = {
            formId: props.formId,
            rootId: props.rootId,
            typeChecker: props.typeChecker,
            path: props.path,
            locationName: props.locationName,
            iteration: 0,
            hideIterationInPath: true,
            isInRootNode: props.rootId === props.id,
            index: undefined,
            id: undefined,
        }
        if (duplicateTimes !== -1) {
            return duplicateTimes === 0 ? <NotRequiredSectionPage key={'nr' + props.locationName} /> :
                getTabbedView({ ...eachChildProp, hideIterationInPath: false }, props.childNodes, duplicateTimes);
        }

        return getChildren(
            eachChildProp, props.childNodes
        );
    }
    return (
        <Card style={{ marginTop: 16 }}>
            {renderContext.renderSectionHeader(props.name, props.path, props.rootId === props.id ? "root" : "section")}
            {decisiveRender(props.duplicateTimes)}
        </Card>
    )
}
function NotRequiredSectionPage() {
    return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Not Required to Fill"} >
        </Empty>
    )
}