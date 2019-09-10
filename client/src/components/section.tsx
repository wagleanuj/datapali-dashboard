import { ButtonGroup } from "@blueprintjs/core";
import { QAQuestion } from "../form/question";
import React from "react";
import { QuestionButton } from "./questionButton";
import { DPFormItem } from "./DPFormItem";
import { SectionButton } from "./sectionButton";
import _ from "lodash";
import { getReadablePath } from "../form/util";
import { Constants } from "../form/constants";
import { QuestionSection } from "../form/questionSection";
import { RootSection } from "../form/rootSection";
import { IDupeSettings } from "../form/duplicateSettings";
import { DuplicateSettings } from "./duplicateSettings";

interface SectionCProps {
    constants: Constants,
    section: QuestionSection | RootSection,
    definedQuestions: { [key: string]: QAQuestion }
    handleQuestionChange: (question: QAQuestion, _path: number[]) => void,
    parentPath: number[],
    handleDeleteChildSectionOrQuestion: (deleteid: string, _path: number[]) => void,
    handleSectionDuplicatingSettingsChange: (id: string, dupe: IDupeSettings) => void,
    handleSectionClick: (sectionid: string, _path: number[]) => void,
    handleSectionNameChange: (id: string, v: string) => void
    handleMoveUp: (id: string, path: number[]) => void,
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
    handleDuplicatingSettingsSave(id: string, dupe: IDupeSettings) {
        if (this.props.handleSectionDuplicatingSettingsChange) this.props.handleSectionDuplicatingSettingsChange(id, dupe)
    }
    handleDuplicatingSettingsCancel() {

    }

    render() {
        let comp = null;
        let readablePath = getReadablePath(this.props.parentPath);
        if (readablePath) readablePath += ".";
        comp = this.props.section.content.map((item, index) => {
            let childPath = this.props.parentPath.concat(index);
            if (item instanceof QAQuestion) {
                return <QuestionButton
                    questionTitle={item.questionContent.content}
                    handleMoveUp={this.props.handleMoveUp}
                    path={childPath}
                    questionId={item.id}
                    handleDeletion={this.props.handleDeleteChildSectionOrQuestion}
                    readablePath={readablePath + (index + 1)}
                    key={item.id}
                    isExpanded={false}>
                    <DPFormItem
                        constants={this.props.constants}
                        definedQuestions={this.props.definedQuestions}
                        onChange={(q) => this.handleQuestionChange(q, childPath)}
                        question={item} />
                </QuestionButton>
            }
            else if (item instanceof QuestionSection) {
                return <SectionButton
                    handleMoveUp={this.props.handleMoveUp}
                    sectionName={item.name}
                    handleSectionNameChange={(v) => this.props.handleSectionNameChange(item.id, v)}
                    path={childPath}
                    handleDeletion={this.props.handleDeleteChildSectionOrQuestion}
                    sectionId={item.id} readablePath={readablePath + (index + 1)}
                    key={item.id} onClick={this.props.handleSectionClick}>
                    <DuplicateSettings definedQuestions={this.props.definedQuestions} handleSave={(d) => this.handleDuplicatingSettingsSave(item.id, d)} handleCancel={this.handleDuplicatingSettingsCancel} {...item.duplicatingSettings} />
                </SectionButton>
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





