import { getRandomId, QAQuestion, QuestionSection, RootSection } from "dpform";


export class Answer {
    questionId: string;
    answer: string;
    constructor(questionId: string) {
        this.questionId = questionId;
    }
    setAnswer(answer: string) {
        this.answer = answer;
        return this;
    }
    getAnswer() {
        return this.answer;
    }
}



export class AnswerStore {
    root: RootSection;
    store: any[]
    lastModified: number;
    id: string;
    constructor(root?: RootSection) {
        if (root) this.root = root;
        this.id = getRandomId("as-");
    }
    _handleErrors() {
        if (!this.root) throw new Error("Root has not been set");
        if (!this.store) throw new Error("Store has not been initialized");
    }
    setRoot(root: RootSection) {
        this.root = root;
    }
    static fromJSON(obj: any) {
        let a = new AnswerStore();
        const collector = (itemarray) => {
            let collected = [];

            itemarray.forEach(g => {
                if (Array.isArray(g)) {
                    collected.push(collector(g));
                } else {
                    let ans = undefined;
                    if (g) {
                        ans = new Answer(g.questionId).setAnswer(g.answer);
                    }
                    collected.push(ans);

                }
            });

            return collected;
        }
        a.store = collector(obj.store);
        a.lastModified = obj.lastModified;
        return a;
    }
    static toJSON(a: AnswerStore): any {
        let collector = (itemarray) => {
            let collected = [];
            itemarray.forEach(item => {
                if (Array.isArray(item)) {

                    collected.push(collector(item))
                } else {
                    if (item instanceof Answer) {
                        collected.push({ questionId: item.questionId, answer: item.answer });
                    }
                }
            })
            return collected;

        }
        let r = {
            store: collector(a.store),
            lastModified: a.lastModified
        }
        return r;
    }

    getFromPath(path: number[]) {
        const copiedPath = path.slice(0);
        let currentItem = this.store;
        while (copiedPath.length > 0) {
            const current = copiedPath.shift();
            let tempCurrentItem = currentItem[current];
            if (!tempCurrentItem) {
                if (!currentItem[0]) return;
                let cloned = this.cloneSectionEmpty(currentItem[0]);
                currentItem[current] = cloned;
                currentItem = currentItem[current];
            } else {
                currentItem = tempCurrentItem;
            }
        }
        return currentItem;
    }
    /**
     * 
     * @param id 
     * @param selfPath is where the question is being accessed from.
     */
    getById(id: string, selfPath?: number[]) {
        if (!this.root) throw new Error("Root has not been set.");
        let qPath = [];
        let found = false;
        let parent = null;
        this.root.descendants((node, path, parent) => {
            if (found) return false;
            if (node.id === id) {
                qPath = path;
                found = true;
                parent = parent;
            }
        });
        let r = this.getAnswerFor(qPath, 0);

        if (found) {

            let check = this.checkIfDuplicated(qPath);
            if (!check.isDuplicated || (check.isDuplicated && check.fromParent)) {
                return r;
            }
        } else {
            console.log("cant find reference", id);
        }

        return undefined;
    }

    checkIfDuplicated(qPath: number[]) {
        this._handleErrors();
        let question = RootSection.getFromPath(qPath, [this.root]);
        if (!(question instanceof QAQuestion)) throw new Error("provided path is not a question");
        let path = qPath.slice();
        while (path.length > 1) {
            path.pop();
            let section = RootSection.getFromPath(path, [this.root]);
            if (section instanceof QuestionSection && section.duplicatingSettings.isEnabled) {
                let fromParent = path.length === qPath.length - 1
                return { fromParent: fromParent, isDuplicated: true };
            }
        }
        return { fromParent: false, isDuplicated: false };
    }

    init() {
        if (!this.root) throw new Error("Root has not been initialized");
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
                    placeholders.push(a);
                }
            }
            return placeholders;
        }
        this.store = [prepare(this.root, [0])];
        this.lastModified = new Date().getTime();
        console.log(this.store);
        return this;
    }

    cloneSectionEmpty(sectionArray: any[]) {
        let re = [];
        for (let i = 0; i < sectionArray.length; i++) {
            if (Array.isArray(sectionArray[i])) {
                re.push(this.cloneSectionEmpty(sectionArray[i]));
            } else {
                re.push(new Answer(sectionArray[i].questionId));
            }
        }
        return re;
    }

    setAnswerFor(path: number[], value: string) {
        if (!this.store) throw new Error("Answer store not initiated");
        let ans = this.getFromPath(path);
        console.log(path);
        console.log(ans);
        if (!ans) throw new Error("answer store is not set correctly");
        if (ans instanceof Answer) {
            this.lastModified = new Date().getTime();
            ans.setAnswer(value);
        }
        return this;
    }

    getAnswerFor(path: number[]) {
        if (!this.store) throw new Error("Answer store not initiated");
        let s = this.getFromPath(path);
        if (!s) return undefined;
        if (s instanceof Answer) {
            return s.getAnswer();
        }
    }

}