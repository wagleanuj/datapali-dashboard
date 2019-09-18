"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var condition_1 = require("./condition");
var duplicateSettings_1 = require("./duplicateSettings");
var question_1 = require("./question");
var questionSection_1 = require("./questionSection");
var util_1 = require("./util");
var lodash_1 = require("lodash");
var RootSection = /** @class */ (function () {
    function RootSection() {
        this.questions = {};
        this.sections = {};
        this.content = [];
        this.name = '';
        this.id = util_1.getRandomId('root-');
    }
    RootSection.getFromPath = function (path, root) {
        var el = root[path[0]];
        if (path.length === 1) {
            return el;
        }
        if (el.content) {
            return RootSection.getFromPath(path.slice(1), el.content);
        }
    };
    RootSection.prototype.descendants = function (callback) {
        var iterate = function (node, path) {
            for (var i = 0; i < node.content.length; i++) {
                var current = node.content[i];
                if (current) {
                    var cont = callback(current, path.concat(i), node);
                    if (current instanceof questionSection_1.QuestionSection && (lodash_1.isNil(cont) || cont === true)) {
                        iterate(current, path.concat(i));
                    }
                }
            }
        };
        iterate(this, [0]);
    };
    RootSection.Entries = function (root, sectionPath, startIndex, fetchType) {
        var stack = [];
        var rt = [];
        var cloned = sectionPath.slice(0);
        stack.push({ path: sectionPath, startIndex: startIndex });
        for (var i = 0; i < sectionPath.length - 1; i++) {
            stack.push({ path: cloned.slice(0, cloned.length - 1), startIndex: cloned[cloned.length - 1] + 1 });
            cloned.pop();
        }
        while (stack.length > 0) {
            var p = stack.shift();
            if (p) {
                var section = RootSection.getFromPath(p.path, [root]);
                if (section) {
                    for (var i = p.startIndex; i < section.content.length; i++) {
                        var item = section.content[i];
                        if (item instanceof question_1.QAQuestion) {
                            if (!fetchType || fetchType === QORS.QUESTION) {
                                rt.push({ path: p.path.concat(i), data: item });
                            }
                        }
                        else {
                            if (!fetchType || fetchType === QORS.SECTION) {
                                rt.push({ path: p.path.concat(i), data: item });
                            }
                            stack.push({ path: p.path.concat(i), startIndex: 0 });
                        }
                    }
                }
            }
        }
        return rt;
    };
    RootSection.prototype.addQuestion = function (parentPath, q) {
        if (!q) {
            q = [new question_1.QAQuestion()];
        }
        var section = RootSection.getFromPath(parentPath, [this]);
        for (var i = 0; i < q.length; i++) {
            var current = q[i];
            if (this.questions[current.id]) {
                throw new Error('Question id conflict');
            }
            this.questions[current.id] = current;
            if (section && !(section instanceof question_1.QAQuestion)) {
                section.content.push(current);
            }
        }
        return this;
    };
    RootSection.prototype.addSection = function (parentPath, q) {
        if (!q) {
            q = [new questionSection_1.QuestionSection()];
        }
        var section = RootSection.getFromPath(parentPath, [this]);
        for (var i = 0; i < q.length; i++) {
            var current = q[i];
            if (this.questions[current.id]) {
                throw new Error('Section id conflict');
            }
            this.sections[current.id] = current;
            if (section && !(section instanceof question_1.QAQuestion)) {
                section.content.push(current);
            }
        }
        return this;
    };
    RootSection.prototype.removeQuestion = function (questionId, path) {
        var parentSection = RootSection.getFromPath(path.slice(0, path.length - 1), [this]);
        if (parentSection && !(parentSection instanceof question_1.QAQuestion)) {
            var foundIndex = parentSection.content.findIndex(function (item) { return item.id === questionId; });
            if (foundIndex > -1) {
                parentSection.content.splice(foundIndex, 1);
                delete this.questions[questionId];
            }
        }
        return this;
    };
    RootSection.prototype.removeSection = function (sectionId, path) {
        var parentSection = RootSection.getFromPath(path.slice(0, path.length - 1), [this]);
        if (parentSection && !(parentSection instanceof question_1.QAQuestion)) {
            var foundIndex = parentSection.content.findIndex(function (item) { return item.id === sectionId; });
            if (foundIndex > -1) {
                parentSection.content.splice(foundIndex, 1);
                delete this.sections[sectionId];
            }
        }
        return this;
    };
    RootSection.prototype.moveItem = function (prevPath, newPath) {
        var itemAtPath = RootSection.getFromPath(prevPath, [this]);
        var newParentPath = newPath.slice(0, newPath.length - 1);
        var oldParentPath = prevPath.slice(0, prevPath.length - 1);
        var newParent = RootSection.getFromPath(newParentPath, [this]);
        var oldParent = RootSection.getFromPath(oldParentPath, [this]);
        if (oldParent && newParent && itemAtPath) {
            var foundIndex = oldParent.content.findIndex(function (item) { return item.id === itemAtPath.id; });
            if (foundIndex > -1 && !(oldParent instanceof question_1.QAQuestion)) {
                var removed = oldParent.content.splice(foundIndex, 1);
                if (!(newParent instanceof question_1.QAQuestion)) {
                    var pos = newPath[newPath.length - 1];
                    if (removed[0] instanceof questionSection_1.QuestionSection) {
                        newParent.content.splice(pos, 0, this.sections[removed[0].id]);
                    }
                    else if (removed[0] instanceof question_1.QAQuestion) {
                        newParent.content.splice(pos, 0, this.questions[removed[0].id]);
                    }
                }
                return this;
            }
        }
    };
    RootSection.toJSON = function (a) {
        var r = {
            id: a.id,
            name: a.name,
            content: a.content.map(function (item) {
                if (item instanceof questionSection_1.QuestionSection) {
                    return questionSection_1.QuestionSection.toJSON(item);
                }
                else if (item instanceof question_1.QAQuestion) {
                    return question_1.QAQuestion.toJSON(item);
                }
            }),
        };
        return r;
    };
    RootSection.fromJSON = function (a) {
        var r = new RootSection();
        r.id = a.id;
        r.name = a.name;
        var path = [0];
        var handleSectionAdd = function (a, parentPath, index) {
            if (a.hasOwnProperty('content')) {
                var section = new questionSection_1.QuestionSection();
                section.id = a.id;
                section.name = a.name;
                if (a.appearingCondition) {
                    section.appearingCondition = condition_1.QACondition.fromJSON(a.appearingCondition);
                }
                section.duplicatingSettings = duplicateSettings_1.dupeSettingsFromJSON(a.duplicatingSettings);
                r.addSection(parentPath, [section]);
                a.content.forEach(function (item, i) { return handleSectionAdd(item, parentPath.concat(index), i); });
            }
            else {
                var question = question_1.QAQuestion.fromJSON(a);
                r.addQuestion(parentPath, [question]);
            }
        };
        a.content.forEach(function (item, index) { return handleSectionAdd(item, path, index); });
        return r;
    };
    RootSection.prototype.Iterator2 = function (sectionPath, index, fetchType) {
        var section, current, _i, _a, q, _b, _c, q;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (sectionPath.length === 0) {
                        return [2 /*return*/, true];
                    }
                    section = RootSection.getFromPath(sectionPath, [this]);
                    if (!(section && !(section instanceof question_1.QAQuestion))) return [3 /*break*/, 16];
                    _d.label = 1;
                case 1:
                    if (!(index < section.content.length)) return [3 /*break*/, 11];
                    current = section.content[index];
                    if (!(current instanceof question_1.QAQuestion)) return [3 /*break*/, 4];
                    if (!(fetchType === QORS.QUESTION || !fetchType)) return [3 /*break*/, 3];
                    return [4 /*yield*/, {
                            path: sectionPath.concat(index),
                            data: current,
                        }];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 10];
                case 4:
                    if (!(current instanceof questionSection_1.QuestionSection)) return [3 /*break*/, 10];
                    if (!(fetchType === QORS.SECTION || !fetchType)) return [3 /*break*/, 6];
                    return [4 /*yield*/, {
                            path: sectionPath.concat(index),
                            data: current,
                        }];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    index++;
                    _i = 0, _a = this.Iterator2(sectionPath.concat(index), 0, fetchType);
                    _d.label = 7;
                case 7:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    q = _a[_i];
                    return [4 /*yield*/, q];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 7];
                case 10: return [3 /*break*/, 1];
                case 11:
                    if (!(sectionPath && sectionPath.length > 0)) return [3 /*break*/, 15];
                    index = sectionPath[sectionPath.length - 1] + 1;
                    _b = 0, _c = this.Iterator2(sectionPath, index, fetchType);
                    _d.label = 12;
                case 12:
                    if (!(_b < _c.length)) return [3 /*break*/, 15];
                    q = _c[_b];
                    return [4 /*yield*/, q];
                case 13:
                    _d.sent();
                    _d.label = 14;
                case 14:
                    _b++;
                    return [3 /*break*/, 12];
                case 15: return [2 /*return*/, true];
                case 16: return [2 /*return*/];
            }
        });
    };
    return RootSection;
}());
exports.RootSection = RootSection;
var QORS;
(function (QORS) {
    QORS[QORS["QUESTION"] = 1] = "QUESTION";
    QORS[QORS["SECTION"] = 2] = "SECTION";
})(QORS = exports.QORS || (exports.QORS = {}));
