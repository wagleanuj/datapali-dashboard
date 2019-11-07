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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var core_1 = require("@blueprintjs/core");
var react_select_1 = __importDefault(require("react-select"));
var DPFormItem_1 = require("./DPFormItem");
var lodash_1 = __importDefault(require("lodash"));
var classnames_1 = __importDefault(require("classnames"));
var DuplicateSettings = (function (_super) {
    __extends(DuplicateSettings, _super);
    function DuplicateSettings(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isEnabled: _this.props.isEnabled,
            condition: _this.props.condition,
            duplicateTimes: _this.props.duplicateTimes
        };
        return _this;
    }
    DuplicateSettings.prototype.handleQuestionRefChange = function (newValue) {
        this.setState({
            duplicateTimes: { value: newValue.value, type: "questionRef" }
        });
    };
    DuplicateSettings.prototype.handleNumberTimesChange = function (newValue) {
        this.setState({
            duplicateTimes: { value: newValue, type: "number" }
        });
    };
    DuplicateSettings.prototype.handleTypeChange = function (newType) {
        this.setState(function (prevState) {
            return {
                duplicateTimes: { value: "", type: newType.value }
            };
        });
    };
    DuplicateSettings.prototype.handleEnabledChange = function () {
        this.setState(function (prevState) {
            return {
                isEnabled: !prevState.isEnabled
            };
        });
    };
    DuplicateSettings.prototype.generateValueComponent = function (type) {
        var _this = this;
        if (type === "questionRef") {
            var options = Object.values(this.props.definedQuestions).map(function (item) { return ({ value: item.id, label: item.questionContent.content }); });
            var selected = this.state.duplicateTimes.type === "questionRef" ? options.find(function (item) { return item.value === _this.state.duplicateTimes.value; }) : undefined;
            return react_1.default.createElement(react_select_1.default, { styles: DPFormItem_1.customStyles, options: options, defaultValue: selected, onChange: this.handleQuestionRefChange.bind(this) });
        }
        return react_1.default.createElement("input", { defaultValue: this.state.duplicateTimes.type === "number" ? this.state.duplicateTimes.value : "", type: "number", className: "form-control", onChange: function (e) { return _this.handleNumberTimesChange(e.target.value); } });
    };
    DuplicateSettings.prototype.handleSave = function () {
        var isInvalid = lodash_1.default.values(this.state).every(lodash_1.default.isEmpty);
        if (!isInvalid) {
            this.props.handleSave({ isEnabled: this.state.isEnabled, condition: this.state.condition, duplicateTimes: this.state.duplicateTimes });
        }
    };
    DuplicateSettings.prototype.render = function () {
        var _this = this;
        var typeOptions = [{ value: "number", label: "Number" }, { value: "questionRef", label: "AnswerValue" }];
        var defaultValue = typeOptions.find(function (item) { return item.value === _this.state.duplicateTimes.type; });
        return (react_1.default.createElement(core_1.ButtonGroup, { className: classnames_1.default(core_1.Classes.ELEVATION_2, core_1.Classes.DARK), vertical: true, fill: true },
            react_1.default.createElement(core_1.Switch, { onChange: this.handleEnabledChange.bind(this), defaultChecked: this.props.isEnabled }, "Enabled"),
            react_1.default.createElement(core_1.Divider, null),
            react_1.default.createElement(react_select_1.default, { menuContainerStyle: { zIndex: 99999 }, styles: DPFormItem_1.customStyles, onChange: function (e) { return _this.handleTypeChange(e); }, options: typeOptions, defaultValue: defaultValue }),
            this.generateValueComponent(this.state.duplicateTimes.type),
            react_1.default.createElement(core_1.Divider, null),
            react_1.default.createElement(core_1.ButtonGroup, { fill: true },
                react_1.default.createElement(core_1.Button, { onClick: this.handleSave.bind(this) }, "Save"),
                react_1.default.createElement(core_1.Button, { onClick: this.props.handleCancel }, "Cancel"))));
    };
    return DuplicateSettings;
}(react_1.default.Component));
exports.DuplicateSettings = DuplicateSettings;
