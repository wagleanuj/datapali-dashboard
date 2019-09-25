import { QAQuestion } from './question';
import { QACondition } from './condition';
import { getRandomId } from './util';
import { IDupeSettings, dupeSettingsToJSON } from './duplicateSettings';

export class QuestionSection {
    name!: string;
    content!: (QuestionSection | QAQuestion)[];
    id: string;
    duplicatingSettings: IDupeSettings;
    appearingCondition: QACondition;
    customId: string='';
    constructor() {
        this.id = getRandomId('ss-');
        this.duplicatingSettings = {
            condition: undefined,
            isEnabled: false,
            duplicateTimes: { value: '', type: 'number' },
        };
        this.content = [];
        this.appearingCondition = new QACondition;

    }
    static toJSON(a: QuestionSection): any {
        return ({
            name: a.name,
            id: a.id,
            appearingCondition: QACondition.toJSON(a.appearingCondition),
            customId: a.customId,
            content: a.content.map(item => {
                if (item instanceof QuestionSection) {
                    return QuestionSection.toJSON(item);
                } else if (item instanceof QAQuestion) {
                    return QAQuestion.toJSON(item);
                }
            }),
            duplicatingSettings: dupeSettingsToJSON(a.duplicatingSettings),
        });
    }

    setID(id: string) {
        this.id = id;
        return this;
    }
    setName(name: string) {
        this.name = name;
        return this;
    }
    setContent(content: (QuestionSection | QAQuestion)[]) {
        this.content = content;
        return this;
    }

    addContent(content: QuestionSection | QAQuestion) {
        this.content.push(content);
        return this;
    }

    deleteContent(contentId: string) {
        const found = this.content.findIndex(item => item.id === contentId);
        if (found > -1) {
            this.content.splice(found, 1);
        }
    }
    setDuplicatingSettings(dupe: IDupeSettings) {
        this.duplicatingSettings = dupe;
        return this;
    }
}
