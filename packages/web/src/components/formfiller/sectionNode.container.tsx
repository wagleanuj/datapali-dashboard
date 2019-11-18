import { connect } from "react-redux";
import { IAppState } from "../../types";
import { SectionNode } from "./sectionNode.component";
import { getChildrenOfSectionFromId, getDupeTimesForSectionNode } from "./selectors/nodeSelector";

const mapStateToProps = (state: IAppState, props: any) => {
    const dupe = getDupeTimesForSectionNode(state, props);
    return {
        childNodes: getChildrenOfSectionFromId(state, props),
        duplicateTimes: dupe,

    }
}

export const ConnectedSectionNode = connect(mapStateToProps, null)(SectionNode);