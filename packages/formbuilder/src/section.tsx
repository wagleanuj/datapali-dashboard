import { ButtonGroup } from "@blueprintjs/core";
import { Constants, getReadablePath, IDupeSettings, ILiteral, QACondition, QAQuestion, QuestionSection, RootSection } from "@datapali/dpform";
import React from "react";
import { destroyModal, openModal } from "./utils";
import { CreateConditionModal } from "./CreateConditionModal";
import { DPFormItem } from "./DPFormItem";
import { DuplicateSettings } from "./duplicateSettings";
import { QuestionButton } from "./questionButton";
import { SectionButton } from "./sectionButton";

interface SectionCProps {
    constants: Constants;
    section: QuestionSection | RootSection;
    definedQuestions: { [key: string]: QAQuestion };
    handleQuestionChange: (question: QAQuestion, _path: number[]) => void;
    parentPath: number[];
    handleDeleteChildSectionOrQuestion: (deleteid: string, _path: number[]) => void;
    handleSectionDuplicatingSettingsChange: (id: string, dupe: IDupeSettings) => void;
    handleSectionClick: (sectionid: string, _path: number[]) => void;
    handleSectionNameChange: (id: string, v: string) => void;
    handleMoveUp: (id: string, path: number[]) => void;
    handleSectionConditionChange: (sectionId: string, literals: ILiteral[]) => void;
    handleSectionCustomIdChange: (sectionId: string, customId: string) => void;
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
    openConditionSettings(section: QuestionSection) {
        const condition: QACondition = section.appearingCondition;

        let el = <CreateConditionModal
            definedQuestions={this.props.definedQuestions}
            isOpen={true}
            onSubmit={(l) => {
                this.props.handleSectionConditionChange(section.id, l);
                destroyModal();
            }}
            onCancel={destroyModal.bind(this)}
            condition={condition} />
        openModal(el);
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
                    customId={item.customId}
                    handleCustomIdChange={(v) => this.props.handleSectionCustomIdChange(item.id, v)}
                    handleMoveUp={this.props.handleMoveUp}
                    sectionName={item.name}
                    handleSectionNameChange={(v) => this.props.handleSectionNameChange(item.id, v)}
                    path={childPath}
                    handleDeletion={this.props.handleDeleteChildSectionOrQuestion}
                    sectionId={item.id} readablePath={readablePath + (index + 1)}
                    handleOpenConditionSettings={() => this.openConditionSettings(item)}
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





