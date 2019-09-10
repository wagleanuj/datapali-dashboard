import { QAQuestion } from "./question";
import { QuestionSection } from "./questionSection";
import { QACondition } from "./condition";
import { dupeSettingsFromJSON, getRandomId } from "./util";

export class RootSection {
    questions: { [key: string]: QAQuestion } = {};
    sections: { [key: string]: QuestionSection } = {};
    content: (QuestionSection | QAQuestion)[] = [];
    name: string = "";
    id: string;
    constructor() {
        this.id = getRandomId("root-");
    }

    static getFromPath(path: number[], root: (RootSection | QuestionSection | QAQuestion)[]): RootSection | QuestionSection | QAQuestion {
        let el = root[path[0]];
        if (path.length === 1) return el;
        return RootSection.getFromPath(path.slice(1), el.content)
    }


    addQuestion(parentPath: number[], q?: (QAQuestion)[]) {
        if (!q) q = [new QAQuestion()];
        let section = RootSection.getFromPath(parentPath, [this])
        for (let i = 0; i < q.length; i++) {
            let current = q[i];
            if (this.questions[current.id]) throw new Error("Question id conflict");
            this.questions[current.id] = current;
            if (!(section instanceof QAQuestion)) {
                section.content.push(current);
            }


        }
        return this;
    }

    addSection(parentPath: number[], q?: (QuestionSection)[]) {
        if (!q) q = [new QuestionSection()];
        let section = RootSection.getFromPath(parentPath, [this])
        for (let i = 0; i < q.length; i++) {
            let current = q[i];
            if (this.questions[current.id]) throw new Error("Section id conflict");
            this.sections[current.id] = current;
            if (!(section instanceof QAQuestion)) {
                section.content.push(current);
            }
        }
        return this;
    }

    removeQuestion(questionId: string, path: number[]) {
        let parentSection = RootSection.getFromPath(path.slice(0, path.length - 1), [this]);
        if (!(parentSection instanceof QAQuestion)) {
            let foundIndex = parentSection.content.findIndex(item => item.id === questionId);
            if (foundIndex > -1) {
                parentSection.content.splice(foundIndex, 1);
                delete this.questions[questionId];
            }
        }
        return this;
    }

    removeSection(sectionId: string, path: number[]) {
        let parentSection = RootSection.getFromPath(path.slice(0, path.length - 1), [this]);
        if (!(parentSection instanceof QAQuestion)) {
            let foundIndex = parentSection.content.findIndex(item => item.id === sectionId);
            if (foundIndex > -1) {
                parentSection.content.splice(foundIndex, 1);
                delete this.sections[sectionId];
            }
        }
        return this;
    }

    moveItem(prevPath: number[], newPath: number[]) {
        let itemAtPath = RootSection.getFromPath(prevPath, [this]);
        let newParentPath = newPath.slice(0, newPath.length - 1);
        let oldParentPath = prevPath.slice(0, prevPath.length - 1);
        let newParent = RootSection.getFromPath(newParentPath, [this]);
        let oldParent = RootSection.getFromPath(oldParentPath, [this]);
        let foundIndex = oldParent.content.findIndex(item => item.id === itemAtPath.id);
        if (foundIndex > -1 && !(oldParent instanceof QAQuestion)) {
            let removed = oldParent.content.splice(foundIndex, 1);

            if (!(newParent instanceof QAQuestion)) {
                let pos = newPath[newPath.length - 1];
                if (removed[0] instanceof QuestionSection) {
                    newParent.content.splice(pos, 0, this.sections[removed[0].id]);
                }
                else if (removed[0] instanceof QAQuestion) {
                    newParent.content.splice(pos, 0, this.questions[removed[0].id])
                }
            }
            return this;
        }

    }
    static toJSON(a: RootSection):any {
        let r = {
            id: a.id,
            name: a.name,
            content: a.content.map(item => {
                if (item instanceof QuestionSection) {
                    return QuestionSection.toJSON(item);
                }
                else if (item instanceof QAQuestion) {
                    return QAQuestion.toJSON(item);
                }
            }),

        };
        return r;
    }

    static fromJSON(a: any): RootSection {
        let r = new RootSection();
        r.id = a.id;
        let path = [0];
        const handleSectionAdd = (a: any, parentPath: number[], index: number) => {
            if (a.hasOwnProperty("content")) {
                let section = new QuestionSection();
                section.id = a.id;
                section.name = a.name;
                if (a.condition) section.condition = QACondition.fromJSON(a.condition);
                section.duplicatingSettings = dupeSettingsFromJSON(a.duplicatingSettings);
                r.addSection(parentPath, [section]);
                a.content.forEach((item: any, i: number) => handleSectionAdd(item, parentPath.concat(index), i));
            }
            else {
                let question = QAQuestion.fromJSON(a);
                r.addQuestion(parentPath, [question]);
            }
        }
        a.content.forEach((item: any, index: number) => handleSectionAdd(item, path, index))
        return r;
    }
}