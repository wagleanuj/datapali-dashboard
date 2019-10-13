import React from "react"
import { connect } from "react-redux"
import { ConnectedQuestionNode } from "./questionNode"
import { ConnectedSectionNode } from "./sectionNode"
import { AppState } from "../../redux/actions/types"
import { getNodeTypeFromId } from "../../redux/selectors/nodeSelector"

type FormNodeProps = {
    pagerMode: boolean;
    id: string;
    formId: string;
    rootId: string;
    locationName: string;
    path: number[];
    type: string;
}
class FormNode extends React.Component<FormNodeProps, {}>{
    render() {
        const { props } = this;
        return (
            props.type === 'question' ?
                <ConnectedQuestionNode {...props} questionId={props.id} />
                : <ConnectedSectionNode  {...props} sectionId={props.id} />
        )

    }
}
const mapStateToFormNodeProps = (state: AppState, props) => {
    return {
        type: getNodeTypeFromId(state, props)
    }
}

export const ConnectedFormNode = connect(mapStateToFormNodeProps, {})(FormNode);
