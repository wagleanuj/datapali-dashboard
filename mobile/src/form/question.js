"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var condition_1 = require("./condition");
var answer_1 = require("./answer");
var AnswerOptions_1 = require("./AnswerOptions");
var util_1 = require("./util");
var valueType_1 = require("./valueType");
var QAQuestion = /** @class */ (function () {
    function QAQuestion() {
        this.content = [];
        this.autoAnswer = {
            isEnabled: false,
            answeringConditions: [],
        };
        this.options = new AnswerOptions_1.AnswerOptions();
        this.id = util_1.getRandomId('q-');
        this.questionContent = { content: '', type: answer_1.QAType.String };
    }
    QAQuestion.toJSON = function (a) {
        var r = {
            id: a.id,
            isRequired: a.isRequired,
            appearingCondition: condition_1.QACondition.toJSON(a.appearingCondition),
            questionContent: { content: a.questionContent.content, type: a.questionContent.type },
            autoAnswer: autoAnswerToJSON(a.autoAnswer),
            options: AnswerOptions_1.AnswerOptions.toJSON(a.options),
            answerType: a.answerType ? valueType_1.answerTypeToJSON(a.answerType) : undefined,
        };
        return r;
    };
    QAQuestion.fromJSON = function (a) {
        var q = new QAQuestion();
        q.id = a.id;
        q.isRequired = a.isRequired;
        q.appearingCondition = condition_1.QACondition.fromJSON(a.appearingCondition);
        q.questionContent = a.questionContent;
        if (a.options) {
            q.options = AnswerOptions_1.AnswerOptions.fromJSON(a.options);
        }
        if (a.answerType) {
            q.answerType = valueType_1.answerTypeFromJSON(a.answerType);
        }
        if (a.autoAnswer) {
            q.autoAnswer = autoAnswerFromJSON(a.autoAnswer);
        }
        return q;
    };
    QAQuestion.prototype.updateFromQuestion = function (q) {
        this.isRequired = q.isRequired;
        this.appearingCondition = q.appearingCondition;
        this.questionContent = q.questionContent;
        this.autoAnswer = q.autoAnswer;
        this.options = q.options;
        this.answerType = q.answerType;
        return this;
    };
    QAQuestion.prototype.setIsRequired = function (bool) {
        this.isRequired = bool;
        return this;
    };
    QAQuestion.prototype.setAppearingCondition = function (cond) {
        this.appearingCondition = cond;
        return this;
    };
    QAQuestion.prototype.setAutoAnswer = function (a) {
        this.autoAnswer = a;
        return this;
    };
    QAQuestion.prototype.setQuestionContent = function (content) {
        this.questionContent = content;
        return this;
    };
    QAQuestion.prototype.setCreationDate = function (creationDate) {
        if (!creationDate) {
            this.creationDate = new Date().getTime();
        }
        else {
            this.creationDate = creationDate;
        }
        return this;
    };
    QAQuestion.prototype.setAutoAnswerEnabled = function (bool) {
        if (!bool) {
            this.autoAnswer.isEnabled = true;
        }
        else {
            this.autoAnswer.isEnabled = bool;
        }
        return this;
    };
    QAQuestion.prototype.addAutoAnswerCondition = function (aaCond) {
        this.autoAnswer.answeringConditions.push(aaCond);
        return this;
    };
    QAQuestion.prototype.setAnswerType = function (type) {
        this.answerType = type;
        return this;
    };
    QAQuestion.prototype.setOptions = function (opt) {
        this.options = opt;
        return this;
    };
    return QAQuestion;
}());
exports.QAQuestion = QAQuestion;
function answerConditionToJSON(a) {
    return ({
        condition: condition_1.QACondition.toJSON(a.condition),
        ifTrue: (a.ifTrue),
        ifFalse: (a.ifFalse),
    });
}
exports.answerConditionToJSON = answerConditionToJSON;
function answerConditionFromJSON(a) {
    var r = {
        condition: condition_1.QACondition.fromJSON(a.condition),
        ifFalse: a.ifFalse,
        ifTrue: a.ifTrue,
    };
    return r;
}
exports.answerConditionFromJSON = answerConditionFromJSON;
function autoAnswerToJSON(a) {
    if (!a) {
        return undefined;
    }
    return ({
        isEnabled: a.isEnabled,
        answeringConditions: a.answeringConditions.map(function (item) { return answerConditionToJSON(item); }),
    });
}
exports.autoAnswerToJSON = autoAnswerToJSON;
function autoAnswerFromJSON(a) {
    var r = {
        isEnabled: a.isEnabled,
        answeringConditions: a.answeringConditions.map(function (item) { return answerConditionFromJSON(item); }),
    };
    return r;
}
exports.autoAnswerFromJSON = autoAnswerFromJSON;
