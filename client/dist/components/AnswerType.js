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
var DPFormItem_1 = require("./DPFormItem");
var react_select_1 = __importDefault(require("react-select"));
var reactstrap_1 = require("reactstrap");
var lodash_1 = __importDefault(require("lodash"));
var dpform_1 = require("dpform");
var ValueSelectOptions = [
    { value: dpform_1.ANSWER_TYPES.BOOLEAN, label: "YES/NO" },
    { value: dpform_1.ANSWER_TYPES.STRING, label: "Text" },
    { value: dpform_1.ANSWER_TYPES.TIME, label: "Time" },
    { value: dpform_1.ANSWER_TYPES.DATE, label: "Date" },
    { value: dpform_1.ANSWER_TYPES.NUMBER, label: "Number" },
    { value: dpform_1.ANSWER_TYPES.RANGE, label: "Range" },
    { value: dpform_1.ANSWER_TYPES.SELECT, label: "Multiple Choice" },
    { value: dpform_1.ANSWER_TYPES.GEOLOCATION, label: "Geo location" }
];
var OptionsForSelect = ValueSelectOptions.filter(function (item) { return item.value && item.value !== dpform_1.ANSWER_TYPES.SELECT; });
var includedInRange = [dpform_1.ANSWER_TYPES.TIME, dpform_1.ANSWER_TYPES.NUMBER, dpform_1.ANSWER_TYPES.DATE, dpform_1.ANSWER_TYPES.TIME];
var OptionsForRange = ValueSelectOptions.filter(function (item) { return includedInRange.includes(item.value); });
var AnswerTypeInput = (function (_super) {
    __extends(AnswerTypeInput, _super);
    function AnswerTypeInput(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            answerType: _this.props.answerType
        };
        return _this;
    }
    AnswerTypeInput.prototype.handleAnswerTypeChange = function (data) {
        var _this = this;
        this.setState(function (prevState) {
            var newAnswerType = lodash_1.default.clone(prevState.answerType);
            newAnswerType.name = data.value;
            newAnswerType.ofType = undefined;
            return {
                answerType: newAnswerType
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.answerType);
        });
    };
    AnswerTypeInput.prototype.handleSecondSelectChange = function (data) {
        var _this = this;
        this.setState(function (prevState) {
            var newAnswerType = lodash_1.default.clone(prevState.answerType);
            newAnswerType.ofType = { name: data.value, ofType: undefined };
            if (newAnswerType.ofType.ofType)
                newAnswerType.ofType.ofType = undefined;
            return {
                answerType: newAnswerType
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.answerType);
        });
    };
    AnswerTypeInput.prototype.handleThirdSelectChange = function (data) {
        var _this = this;
        this.setState(function (prevState) {
            var newAnswerType = lodash_1.default.clone(prevState.answerType);
            if (newAnswerType.ofType) {
                newAnswerType.ofType.ofType = data.value;
            }
            return {
                answerType: newAnswerType
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.answerType);
        });
    };
    AnswerTypeInput.prototype.render = function () {
        var _this = this;
        var shouldDisplaySecondSelect = this.state.answerType.name === dpform_1.ANSWER_TYPES.SELECT || this.state.answerType.name === dpform_1.ANSWER_TYPES.RANGE;
        var shouldDisplayThirdSelect = this.state.answerType.ofType && this.state.answerType.ofType.name === dpform_1.ANSWER_TYPES.RANGE;
        var optionsForSecondSelect = this.state.answerType.name === dpform_1.ANSWER_TYPES.SELECT ? OptionsForSelect : this.state.answerType.name === dpform_1.ANSWER_TYPES.RANGE ? OptionsForRange : [];
        var OptionsForThirdSelect = this.state.answerType.ofType && this.state.answerType.ofType.name === dpform_1.ANSWER_TYPES.RANGE ? OptionsForRange : [];
        return (react_1.default.createElement(reactstrap_1.Row, null,
            react_1.default.createElement(reactstrap_1.Col, null,
                react_1.default.createElement("label", null, "Value Type"),
                react_1.default.createElement(react_select_1.default, { onChange: this.handleAnswerTypeChange.bind(this), styles: DPFormItem_1.customStyles, options: ValueSelectOptions, value: ValueSelectOptions.find(function (item) { return item.value === _this.state.answerType.name; }) })),
            shouldDisplaySecondSelect && react_1.default.createElement(reactstrap_1.Col, null,
                react_1.default.createElement("label", null, "of type"),
                react_1.default.createElement(react_select_1.default, { onChange: this.handleSecondSelectChange.bind(this), styles: DPFormItem_1.customStyles, options: optionsForSecondSelect, value: optionsForSecondSelect.find(function (item) { return _this.state.answerType.ofType && item.value === _this.state.answerType.ofType.name; }) })),
            shouldDisplayThirdSelect && react_1.default.createElement(reactstrap_1.Col, null,
                react_1.default.createElement("label", null, "of type"),
                react_1.default.createElement(react_select_1.default, { onChange: this.handleThirdSelectChange.bind(this), styles: DPFormItem_1.customStyles, options: OptionsForThirdSelect, value: OptionsForThirdSelect.find(function (item) { return _this.state.answerType.ofType && _this.state.answerType.ofType.ofType && item.value === _this.state.answerType.ofType.ofType.name; }) }))));
    };
    AnswerTypeInput.defaultProps = {
        answerType: { name: undefined, ofType: undefined }
    };
    return AnswerTypeInput;
}(react_1.default.Component));
exports.AnswerTypeInput = AnswerTypeInput;
