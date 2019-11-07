import React from "react";
import { IDupeSettings, QAQuestion } from "dpform";
interface DuplicateSettingsProps extends IDupeSettings {
    definedQuestions: {
        [key: string]: QAQuestion;
    };
    handleSave: (dupe: IDupeSettings) => void;
    handleCancel: () => void;
}
interface DuplicateSettingsState extends IDupeSettings {
}
export declare class DuplicateSettings extends React.Component<DuplicateSettingsProps, DuplicateSettingsState> {
    constructor(props: DuplicateSettingsProps);
    private handleQuestionRefChange;
    private handleNumberTimesChange;
    private handleTypeChange;
    private handleEnabledChange;
    private generateValueComponent;
    private handleSave;
    render(): JSX.Element;
}
export {};
