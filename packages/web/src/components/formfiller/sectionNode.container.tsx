import { connect } from "react-redux";
import { IAppState } from "../../types";
import { SectionNode } from "./sectionNode.component";
import { getChildrenOfSectionFromId, getDupeTimesForSectionNode, getNodeOfRootForm, getTypeChecker } from "./selectors/nodeSelector";

const mapStateToProps = (state: IAppState, props: any) => {
    const dupe = getDupeTimesForSectionNode(state, props);
    const node = getNodeOfRootForm(state, props, props.id);
    return {
        childNodes: getChildrenOfSectionFromId(state, props),
        name: node.name,
        duplicateTimes: dupe,
        typeChecker: getTypeChecker(state, props),

    }
}

export const ConnectedSectionNode = connect(mapStateToProps, null)(SectionNode);