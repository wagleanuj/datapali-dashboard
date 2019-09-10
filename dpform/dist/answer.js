"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Answer = /** @class */ (function () {
    function Answer(content) {
        this.content = content;
    }
    Object.defineProperty(Answer.prototype, "Condition", {
        get: function () {
            return this.condition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Answer.prototype, "Content", {
        get: function () {
            return this.content;
        },
        enumerable: true,
        configurable: true
    });
    Answer.prototype.setContent = function (content) {
        this.content = content;
        return this;
    };
    Answer.prototype.setCondition = function (condition) {
        this.condition = condition;
        return this;
    };
    return Answer;
}());
exports.Answer = Answer;
var QAComparisonOperator;
(function (QAComparisonOperator) {
    QAComparisonOperator["Less_Than_Or_Equal"] = "<=";
    QAComparisonOperator["Greater_Than_Or_Equal"] = ">=";
    QAComparisonOperator["Less_Than"] = "<";
    QAComparisonOperator["Greater_Than"] = ">";
    QAComparisonOperator["Equal"] = "==";
})(QAComparisonOperator = exports.QAComparisonOperator || (exports.QAComparisonOperator = {}));
var AnswerType;
(function (AnswerType) {
    AnswerType["String"] = "String";
    AnswerType["Boolean"] = "Boolean";
    AnswerType["Date"] = "Date";
    AnswerType["Time"] = "Time";
    AnswerType["Number"] = "Number";
    AnswerType["Select"] = "Select";
})(AnswerType = exports.AnswerType || (exports.AnswerType = {}));
var QAType;
(function (QAType) {
    QAType["String"] = "string";
    QAType["html"] = "html";
})(QAType = exports.QAType || (exports.QAType = {}));
