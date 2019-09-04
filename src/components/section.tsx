import { ButtonGroup } from "@blueprintjs/core";
import { QuestionSection } from "./SurveyForm";
import { QAQuestion } from "../form/question";
import React from "react";
import { QuestionButton } from "./questionButton";
import { DPFormItem } from "./DPFormItem";
import { SectionButton } from "./sectionButton";

interface SectionCProps {
    section: QuestionSection,
    handleQuestionChange: (question: QAQuestion, _path: number[]) => void,
    parentPath: number[],
    handleDeleteChildSectionOrQuestion: (deleteid: string, _path: number[]) => void,
    handleSectionClick: (sectionid: string, _path: number[]) => void,
}
interface SectionCState {
}
export class SectionC extends React.Component<SectionCProps, SectionCState>{
    constructor(props: SectionCProps) {
        super(props);
        this.state = {
        }
    }

    handleQuestionChange(q: QAQuestion, path: number[]) {
        if (this.props.handleQuestionChange) this.props.handleQuestionChange(q, path);
    }

    render() {
        let comp = null;
        let readablePath = getReadablePath(this.props.parentPath);
        if (readablePath) readablePath += ".";
        comp = this.props.section.content.map((item, index) => {
            let childPath = this.props.parentPath.concat(index);
            if (item instanceof QAQuestion) {
                return <QuestionButton path={childPath} questionId={item.id} handleDeletion={this.props.handleDeleteChildSectionOrQuestion} readablePath={readablePath + (index + 1)} key={item.id} isExpanded={false}>
                    <DPFormItem onChange={(q) => this.handleQuestionChange(q, childPath)} question={item} />
                </QuestionButton>
            }
            else if (item instanceof QuestionSection) {
                return <SectionButton path={childPath} handleDeletion={this.props.handleDeleteChildSectionOrQuestion} sectionId={item.id} readablePath={readablePath + (index + 1)} key={item.id} onClick={this.props.handleSectionClick}></SectionButton>
            }
            return null;
        })
        return (
            <ButtonGroup fill vertical>
                {comp}

            </ButtonGroup>

        )
    }
}



export function getReadablePath(nu: number[]) {
    return nu.slice(1).map(item => item + 1).join(".");

}
