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
var react_select_1 = __importDefault(require("react-select"));
var DPFormItem_1 = require("./DPFormItem");
var dpform_1 = require("dpform");
var ValueInput = (function (_super) {
    __extends(ValueInput, _super);
    function ValueInput(props) {
        return _super.call(this, props) || this;
    }
    ValueInput.prototype.onDataChange = function (data) {
        if (this.props.onChange) {
            this.props.onChange(data);
        }
    };
    ValueInput.prototype.render = function () {
        var _this = this;
        var comp = null;
        var opt_ = [];
        switch (this.props.questionType) {
            case dpform_1.AnswerType.Boolean:
                opt_ = [{ value: true, label: "True" }, { value: false, label: "False" }];
                comp = react_1.default.createElement(react_select_1.default, { options: opt_, value: opt_.find(function (i) { return typeof _this.props.value.value === "boolean" && i.value === _this.props.value.value; }), onChange: this.props.onChange.bind(this), styles: DPFormItem_1.customStyles });
                break;
            case dpform_1.AnswerType.Date:
                comp = react_1.default.createElement("input", { onChange: function (e) { return _this.onDataChange({ value: e.target.value }); }, className: "form-control", type: "date", defaultValue: this.props.value.value });
                break;
            case dpform_1.AnswerType.Number:
                comp = react_1.default.createElement("input", { onChange: function (e) { return _this.onDataChange({ value: e.target.value }); }, className: "form-control", type: "number", defaultValue: this.props.value.value });
                break;
            case dpform_1.AnswerType.Select:
                comp = react_1.default.createElement(react_select_1.default, { styles: DPFormItem_1.customStyles, onChange: this.onDataChange.bind(this), options: this.props.options, value: this.props.options && this.props.options.find(function (item) { return item.value === _this.props.value; }) });
                break;
            case dpform_1.AnswerType.String:
                comp = react_1.default.createElement("input", { onChange: function (e) { return _this.onDataChange({ value: e.target.value }); }, className: "form-control", type: "text", defaultValue: this.props.value.value });
                break;
            case dpform_1.AnswerType.Time:
                comp = react_1.default.createElement("input", { onChange: function (e) { return _this.onDataChange({ value: e.target.value }); }, className: "form-control", type: "time", defaultValue: this.props.value.value });
                break;
            default:
                comp = react_1.default.createElement("input", { onChange: function (e) { return _this.onDataChange({ value: e.target.value }); }, className: "form-control", type: "text", disabled: true });
                break;
        }
        return comp;
    };
    return ValueInput;
}(react_1.default.Component));
exports.ValueInput = ValueInput;
