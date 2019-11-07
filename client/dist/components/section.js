"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@blueprintjs/core");
var dpform_1 = require("dpform");
var react_1 = __importDefault(require("react"));
var utils_1 = require("../utils");
var CreateConditionModal_1 = require("./CreateConditionModal");
var DPFormItem_1 = require("./DPFormItem");
var duplicateSettings_1 = require("./duplicateSettings");
var questionButton_1 = require("./questionButton");
var sectionButton_1 = require("./sectionButton");
var SectionC = (function (_super) {
    __extends(SectionC, _super);
    function SectionC(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    SectionC.prototype.handleQuestionChange = function (q, path) {
        if (this.props.handleQuestionChange)
            this.props.handleQuestionChange(q, path);
    };
    SectionC.prototype.handleDuplicatingSettingsSave = function (id, dupe) {
        if (this.props.handleSectionDuplicatingSettingsChange)
            this.props.handleSectionDuplicatingSettingsChange(id, dupe);
    };
    SectionC.prototype.handleDuplicatingSettingsCancel = function () {
    };
    SectionC.prototype.openConditionSettings = function (section) {
        var _this = this;
        var condition = section.appearingCondition;
        var el = react_1.default.createElement(CreateConditionModal_1.CreateConditionModal, { definedQuestions: this.props.definedQuestions, isOpen: true, onSubmit: function (l) {
                _this.props.handleSectionConditionChange(section.id, l);
                utils_1.destroyModal();
            }, onCancel: utils_1.destroyModal.bind(this), condition: condition });
        utils_1.openModal(el);
    };
    SectionC.prototype.render = function () {
        var _this = this;
        var comp = null;
        var readablePath = dpform_1.getReadablePath(this.props.parentPath);
        if (readablePath)
            readablePath += ".";
        comp = this.props.section.content.map(function (item, index) {
            var childPath = _this.props.parentPath.concat(index);
            if (item instanceof dpform_1.QAQuestion) {
                return react_1.default.createElement(questionButton_1.QuestionButton, { questionTitle: item.questionContent.content, handleMoveUp: _this.props.handleMoveUp, path: childPath, questionId: item.id, handleDeletion: _this.props.handleDeleteChildSectionOrQuestion, readablePath: readablePath + (index + 1), key: item.id, isExpanded: false },
                    react_1.default.createElement(DPFormItem_1.DPFormItem, { constants: _this.props.constants, definedQuestions: _this.props.definedQuestions, onChange: function (q) { return _this.handleQuestionChange(q, childPath); }, question: item }));
            }
            else if (item instanceof dpform_1.QuestionSection) {
                return react_1.default.createElement(sectionButton_1.SectionButton, { customId: item.customId, handleCustomIdChange: function (v) { return _this.props.handleSectionCustomIdChange(item.id, v); }, handleMoveUp: _this.props.handleMoveUp, sectionName: item.name, handleSectionNameChange: function (v) { return _this.props.handleSectionNameChange(item.id, v); }, path: childPath, handleDeletion: _this.props.handleDeleteChildSectionOrQuestion, sectionId: item.id, readablePath: readablePath + (index + 1), handleOpenConditionSettings: function () { return _this.openConditionSettings(item); }, key: item.id, onClick: _this.props.handleSectionClick },
                    react_1.default.createElement(duplicateSettings_1.DuplicateSettings, __assign({ definedQuestions: _this.props.definedQuestions, handleSave: function (d) { return _this.handleDuplicatingSettingsSave(item.id, d); }, handleCancel: _this.handleDuplicatingSettingsCancel }, item.duplicatingSettings)));
            }
            return null;
        });
        return (react_1.default.createElement(core_1.ButtonGroup, { fill: true, vertical: true }, comp));
    };
    return SectionC;
}(react_1.default.Component));
exports.SectionC = SectionC;
