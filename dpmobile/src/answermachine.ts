import { RootSection, QuestionSection, QAQuestion } from "dpform";

import _ from "lodash";

class Answer {
    questionId: string;
    answer: string;
    constructor(questionId: string) {
        this.questionId = questionId;
    }
    setAnswer(answer: string) {
        this.answer = answer;
    }
    getAnswer() {
        return this.answer;
    }
}


export class AnswerStore {
    root: RootSection;
    store: any[]
    answersMap: Map<string, Answer> = new Map();
    constructor(root: RootSection) {
        this.root = root;
    }
    getFromPath(path: number[], root: { [key: string]: any }[]) {
        const el = root[path[0]];
        if (path.length === 1) { return el; }
        if (Array.isArray(el)) {
            return this.getFromPath(path.slice(1), el);
        }
        return undefined;
    }

    getById(id: string) {
        let a = this.answersMap.get(id);
        if (!a) return undefined;
        return a.getAnswer();
    }

    init() {
        const prepare = (section: QuestionSection | RootSection, path: number[]) => {
            if (section.content.length <= 0) return [];
            let placeholders = [];
            for (let i = 0; i < section.content.length; i++) {
                let current = section.content[i];
                if (current instanceof QuestionSection) {
                    placeholders.push(
                        [prepare(current, path.concat(i))]
                    );
                } else if (current instanceof QAQuestion) {
                    let a = new Answer(current.id);
                    this.answersMap.set(current.id, a);
                    placeholders.push(a);
                }
            }
            return placeholders;
        }
        this.store = [prepare(this.root, [0])];
        return this;
    }
    cloneSectionEmpty(sectionArray: any[]) {
        let re = [];
        for (let i = 0; i < sectionArray.length; i++) {
            if (Array.isArray(sectionArray[i])) {
                re.push(this.cloneSectionEmpty(re[i]));
            } else {
                re.push(new Answer(sectionArray[i].questionId));
            }
        }
        return re;
    }

    setAnswerFor(path: number[], iteration: number, value: string) {
        if (!this.store) throw new Error("Answer store not initiated");
        let parent = path.slice(0);
        let index = parent.pop();
        let ans = this.getFromPath(parent, this.store);
        if (!ans) return undefined;
        if (!ans[iteration]) ans[iteration] = this.cloneSectionEmpty(ans[0]);
        let s = ans[iteration][index];
        if (s instanceof Answer) {
            s.setAnswer(value);
        }

        return this;
    }

    getAnswerFor(path: number[], iteration: number) {
        if (!this.store) throw new Error("Answer store not initiated");
        let parent = path.slice(0);
        let index = parent.pop();

        let ans = this.getFromPath(parent, this.store);

        if (!ans) return undefined;
        if (!ans[iteration]) return undefined;;
        let s = ans[iteration][index];
        if (s instanceof Answer) {
            return s.getAnswer();
        }

        else {
            if (ans[index] instanceof Answer) {
                return ans[index].getAnswer();
            }
        }
    }

}