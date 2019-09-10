"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var question_1 = require("./question");
var condition_1 = require("./condition");
var util_1 = require("./util");
var duplicateSettings_1 = require("./duplicateSettings");
var QuestionSection = /** @class */ (function () {
    function QuestionSection() {
        this.id = util_1.getRandomId('ss-');
        this.duplicatingSettings = {
            condition: undefined,
            isEnabled: false,
            duplicateTimes: { value: '', type: 'number' },
        };
        this.content = [];
        this.condition = new condition_1.QACondition;
    }
    QuestionSection.toJSON = function (a) {
        return ({
            name: a.name,
            id: a.id,
            condition: condition_1.QACondition.toJSON(a.condition),
            content: a.content.map(function (item) {
                if (item instanceof QuestionSection) {
                    return QuestionSection.toJSON(item);
                }
                else if (item instanceof question_1.QAQuestion) {
                    return question_1.QAQuestion.toJSON(item);
                }
            }),
            duplicatingSettings: duplicateSettings_1.dupeSettingsToJSON(a.duplicatingSettings),
        });
    };
    QuestionSection.prototype.setID = function (id) {
        this.id = id;
        return this;
    };
    QuestionSection.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    QuestionSection.prototype.setContent = function (content) {
        this.content = content;
        return this;
    };
    QuestionSection.prototype.addContent = function (content) {
        this.content.push(content);
        return this;
    };
    QuestionSection.prototype.deleteContent = function (contentId) {
        var found = this.content.findIndex(function (item) { return item.id === contentId; });
        if (found > -1) {
            this.content.splice(found, 1);
        }
    };
    QuestionSection.prototype.setDuplicatingSettings = function (dupe) {
        this.duplicatingSettings = dupe;
        return this;
    };
    return QuestionSection;
}());
exports.QuestionSection = QuestionSection;
