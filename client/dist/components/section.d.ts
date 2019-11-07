import { Constants, IDupeSettings, ILiteral, QAQuestion, QuestionSection, RootSection } from "dpform";
import React from "react";
interface SectionCProps {
    constants: Constants;
    section: QuestionSection | RootSection;
    definedQuestions: {
        [key: string]: QAQuestion;
    };
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
export declare class SectionC extends React.Component<SectionCProps, SectionCState> {
    constructor(props: SectionCProps);
    handleQuestionChange(q: QAQuestion, path: number[]): void;
    handleDuplicatingSettingsSave(id: string, dupe: IDupeSettings): void;
    handleDuplicatingSettingsCancel(): void;
    openConditionSettings(section: QuestionSection): void;
    render(): JSX.Element;
}
export {};
