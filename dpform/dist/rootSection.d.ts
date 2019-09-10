import { QAQuestion } from './question';
import { QuestionSection } from './questionSection';
export declare class RootSection {
    questions: {
        [key: string]: QAQuestion;
    };
    sections: {
        [key: string]: QuestionSection;
    };
    content: (QuestionSection | QAQuestion)[];
    name: string;
    id: string;
    constructor();
    static getFromPath(path: number[], root: (RootSection | QuestionSection | QAQuestion)[]): RootSection | QuestionSection | QAQuestion;
    addQuestion(parentPath: number[], q?: (QAQuestion)[]): this;
    addSection(parentPath: number[], q?: (QuestionSection)[]): this;
    removeQuestion(questionId: string, path: number[]): this;
    removeSection(sectionId: string, path: number[]): this;
    moveItem(prevPath: number[], newPath: number[]): this | undefined;
    static toJSON(a: RootSection): any;
    static fromJSON(a: any): RootSection;
    Iterator2(sectionPath: number[], index: number, fetchType?: QORS): any;
}
export declare enum QORS {
    QUESTION = 1,
    SECTION = 2
}
