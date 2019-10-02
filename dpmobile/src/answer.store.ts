import { QuestionSection, RootSection } from "dpform";
import { Answer } from "./answermachine";
type AnswerContent = Array<AnswerSection | Answer>;
export class AnswerSection {
    private content: Array<AnswerContent> = [[]];
    private id: string;
    private lastModified: number;

    constructor(section?: QuestionSection | RootSection) {
        if (section) this.init(section);
        this.lastModified = new Date().getTime();
    }

    static getFromPath(path: number[], a: AnswerSection): AnswerSection | Answer {
        if (path.length % 2 !== 0) throw new Error("Should be even");
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
        // console.log(this.content);
        let ans = AnswerSection.getFromPath(path.slice(0), this);
        if (ans instanceof Answer) {
            ans.setAnswer(value);
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


}
