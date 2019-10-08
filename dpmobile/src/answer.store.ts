import { QuestionSection, RootSection } from "dpform";
type AnswerContent = Array<AnswerSection | Answer>;

export class Answer {
    questionId: string;
    answer: string;
    constructor(questionId: string) {
        this.questionId = questionId;
    }
    static toJSON(a: Answer): any {
        return {
            questionId: a.questionId,
            answer: a.answer,
        }
    }
    static fromJSON(a: any): Answer {
        return new Answer(a.questionId).setAnswer(a.answer);
    }
    setAnswer(answer: string) {
        this.answer = answer;
        return this;
    }
    getAnswer() {
        return this.answer;
    }
}


export class AnswerCache {
    private cache: Map<string, Map<string, string>> = new Map();

    setForQuestion(id: string, path: number[], value: string) {
        if (!this.cache.has(id)) {
            this.cache.set(id, new Map());
        }
        this.cache.get(id).set(path.join("."), value);
    }
    getAnswerFor(id: string, path?: number[]): { path: number[], value: string }[] {
        const m = this.cache.get(id);
        if (!m) return [];
        if (path) return [{ path: path, value: m.get(path.join(".")) }];
        let returnv = [];
        m.forEach((value, key) => {
            returnv.push({ path: key.split('.').map(i => parseInt(i)), value: value });
        });
        return returnv;
    }

}
export class AnswerSection {
    private content: Array<AnswerContent> = [[]];
    private id: string;
    private lastModified: number;
    private cache: AnswerCache;

    constructor(section?: QuestionSection | RootSection) {
        if (section) this.init(section);
        this.lastModified = new Date().getTime();
    }

    hasCache() {
        return !!this.cache;
    }
    getCache() {
        return this.cache;
    }

    buildCache() {
        this.cache = new AnswerCache();
        this.descendants((pos, node, parent) => {
            if (node instanceof Answer && node.getAnswer()) {
                this.cache.setForQuestion(node.questionId, pos, node.getAnswer())
            }
        });
        return this;
    }

    static getFromPath(path: number[], a: AnswerSection): AnswerSection | Answer {
        if (pathpath.length % 2 !== 0) throw new Error("Should be even");
        if (path.length >= 2) {
            let item = AnswerSection.getItem(a, path[0], path[1]);
            if (item && item instanceof AnswerSection && path.slice(2).length >= 2) {
                return AnswerSection.getFromPath(path.slice(2), item);
            }
            return item;
        } else {
            console.log("invalid path");
        }

    }
    getId() {
        return this.id;
    }
    static getItem(section: AnswerSection, iteration: number, index: number): any {
        let iter = section.content[iteration];
        if (!iter) section.setContent(iteration, AnswerSection.cloneContent(section.content[0], true));
        return section.content[iteration][index];
    }

    static clone(answerSection: AnswerSection, shouldClearValues = false) {
        let newSection = new AnswerSection();
        answerSection.content.forEach((placeholder, index) => {
            placeholder.forEach(item => {
                if (item instanceof Answer) {
                    let newAnswer = new Answer(item.questionId).setAnswer(shouldClearValues ? undefined : item.answer);
                    newSection.addContentTo(index, newAnswer);
                } else if (item instanceof AnswerSection) {
                    newSection.addContentTo(index, AnswerSection.clone(item, shouldClearValues));
                }
            })
        });
        return newSection;
    }

    static cloneContent(content: AnswerContent, shouldClearValues = false) {
        let newContent: AnswerContent = [];
        content.forEach(item => {
            if (item instanceof Answer) {
                newContent.push(new Answer(item.questionId).setAnswer(shouldClearValues ? undefined : item.answer));
            } else if (item instanceof AnswerSection) {
                newContent.push(AnswerSection.clone(item, shouldClearValues));
            }
        });
        return newContent;
    }

    static toJSON(a: AnswerSection): { id: string, content: Array<Array<any>> } {
        let ret: { id: string, content: Array<Array<any>>, lastModified: number } = { id: undefined, content: [], lastModified: undefined };
        ret.id = a.id;
        ret.lastModified = a.lastModified;
        a.content.forEach((placeholder, index) => {
            if (placeholder && placeholder.length > 0) {
                let data = [];
                placeholder.forEach((item, i) => {
                    if (item instanceof AnswerSection) {
                        data.push(AnswerSection.toJSON(item));
                    } else if (item instanceof Answer) {
                        data.push(Answer.toJSON(item));
                    }
                });
                ret.content[index] = data;
            };
        });
        return ret;
    }

    getLastModified() {
        return new Date(this.lastModified);
    }

    static fromJSON(a: { id: string, content: Array<Array<any>>, lastModified: number }): AnswerSection {
        let ret = new AnswerSection();
        ret.id = a.id;
        ret.lastModified = a.lastModified;
        a.content.forEach((placeholder, index) => {
            if (placeholder && placeholder.length > 0) {
                let content: Array<Answer | AnswerSection> = [];
                placeholder.forEach((item, i) => {
                    if (item.hasOwnProperty('content')) {
                        content.push(AnswerSection.fromJSON(item));
                    } else {
                        content.push(Answer.fromJSON(item));
                    }
                });
                ret.setContent(index, content);
            }
        });
        return ret;
    }

    init(section: QuestionSection | RootSection): AnswerSection {
        const prepare = (section: QuestionSection | RootSection): Array<Answer | AnswerSection> => {
            let placeholder: Array<Answer | AnswerSection> = [];
            section.content.forEach((item, index) => {
                if (item instanceof QuestionSection) {
                    placeholder.push(new AnswerSection().init(item));
                } else {
                    placeholder.push(new Answer(item.id));
                }
            });
            return placeholder;
        }
        this.id = section.id;
        this.content = [];
        return this.setContent(0, prepare(section));
    }

    setContent(index: number, content: Array<Answer | AnswerSection>) {
        this.content[index] = content;
        return this;
    }

    addContentTo(index: number, content: Answer | AnswerSection) {
        this.content[index].push(content);
        return this;
    }

    setAnswerFor(path, value) {
        let ans = AnswerSection.getFromPath(path.slice(0), this);
        if (ans instanceof Answer) {
            ans.setAnswer(value);
            if (this.cache) {
                this.cache.setForQuestion(ans.questionId, path, value);
            }
            this.lastModified = new Date().getTime();
        } else {
            throw new Error("Invalid path");
        }
    }

    getAnswerFor(path) {
        let ans = AnswerSection.getFromPath(path, this);
        if (ans instanceof Answer) {
            return ans.getAnswer();
        }
        return undefined;
    }

    descendants(callback: (pos: number[], node: AnswerSection | Answer, parent: AnswerSection) => boolean | void) {
        AnswerSection.descendants(this, callback, [])
    }

    static descendants(ansSection: AnswerSection, callback: (pos: number[], node: AnswerSection | Answer, parent: AnswerSection) => boolean | void, startPos: number[] = []) {
        for (let i = 0; i < ansSection.content.length; i++) {
            let placeholder = ansSection.content[i];
            for (let j = 0; j < placeholder.length; j++) {
                let currItem = placeholder[j];
                if (currItem instanceof Answer) {
                    let returnV = callback(startPos.concat(i, j), currItem, ansSection);
                    if (returnV === false) return;
                } else if (currItem instanceof AnswerSection) {
                    let returnV = callback(startPos.concat(i, j), currItem, ansSection);
                    if (returnV === false) return;
                    AnswerSection.descendants(currItem, callback, startPos.concat(i, j));
                }
            }
        }
        return;

    }

    static getAnswerByQuestionRef(ref: string, referredFrom: number[], answerSection: AnswerSection) {
        const path = referredFrom.slice(0);
        let found = { node: undefined, pos: undefined, parent: undefined };
        answerSection.descendants((pos, node, parent) => {
            if (found.node) { return false };
            if (node instanceof Answer && node.questionId === ref) {
                found.node = node;
                found.parent = parent;
                found.pos = pos;
                return false;
            }
        });
        return found;

    }

    getById(id: string): string | undefined {
        if (!this.cache) this.buildCache();
        const val = this.cache.getAnswerFor(id);
        if (val[0]) return val[0].value;


        return undefined;
    }


}

class Validator {
}
