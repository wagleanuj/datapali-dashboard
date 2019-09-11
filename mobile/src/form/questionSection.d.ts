import { QAQuestion } from './question';
import { QACondition } from './condition';
import { IDupeSettings } from './duplicateSettings';
export declare class QuestionSection {
    name: string;
    content: (QuestionSection | QAQuestion)[];
    id: string;
    duplicatingSettings: IDupeSettings;
    condition: QACondition;
    constructor();
    static toJSON(a: QuestionSection): any;
    setID(id: string): this;
    setName(name: string): this;
    setContent(content: (QuestionSection | QAQuestion)[]): this;
    addContent(content: QuestionSection | QAQuestion): this;
    deleteContent(contentId: string): void;
    setDuplicatingSettings(dupe: IDupeSettings): this;
}
