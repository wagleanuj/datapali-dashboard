"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var QACondition = /** @class */ (function () {
    function QACondition() {
        this.literals = Array();
    }
    QACondition.fromJSON = function (data) {
        if (!data) {
            return new QACondition();
        }
        var c = new QACondition();
        var literals = data.literals;
        c.setLiterals(literals);
        return c;
    };
    QACondition.toJSON = function (data) {
        if (!data) {
            return undefined;
        }
        return {
            literals: JSON.parse(JSON.stringify(data.literals)),
        };
    };
    QACondition.checkIfValid = function (condition) {
        if (!condition.literals) {
            return false;
        }
        var isValid = true;
        condition.literals.forEach(function (literal) {
            var validity = Object.values(literal).every(function (x) { return !lodash_1.default.isNil(x); });
            if (!validity) {
                isValid = false;
            }
        });
        console.log(isValid);
        return isValid;
    };
    QACondition.Clone = function (condition) {
        var newCondition = new QACondition();
        return newCondition;
    };
    QACondition.prototype.setLiterals = function (newLiterals) {
        this.literals = newLiterals;
        return this;
    };
    QACondition.prototype.getClause = function () {
        var _this = this;
        var clause = '';
        this.literals.forEach(function (literal, key) {
            clause += "l" + key + (key === _this.literals.length - 1 ? literal.followingOperator : '');
        });
        return clause;
    };
    Object.defineProperty(QACondition.prototype, "Literals", {
        get: function () {
            return this.literals;
        },
        enumerable: true,
        configurable: true
    });
    QACondition.prototype.addLiteral = function (literal) {
        this.literals.push(literal);
        console.log(this.literals);
    };
    QACondition.prototype.deleteLiteral = function (literalIndex) {
        this.literals.splice(literalIndex, 1);
        return this;
    };
    return QACondition;
}());
exports.QACondition = QACondition;
var QAFollowingOperator;
(function (QAFollowingOperator) {
    QAFollowingOperator["OR"] = "||";
    QAFollowingOperator["AND"] = "&";
})(QAFollowingOperator = exports.QAFollowingOperator || (exports.QAFollowingOperator = {}));
