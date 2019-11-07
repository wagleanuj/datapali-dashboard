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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var datetime_1 = require("@blueprintjs/datetime");
var core_1 = require("@blueprintjs/core");
var react_select_1 = __importDefault(require("react-select"));
var DPFormItem_1 = require("./DPFormItem");
var dpform_1 = require("dpform");
var RangeInput = (function (_super) {
    __extends(RangeInput, _super);
    function RangeInput(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    RangeInput.prototype.parseRangeValue = function (range) {
        var d = range.split("-");
        return { min: d[0], max: d[1] };
    };
    RangeInput.prototype.handleInputChange = function (data) {
        var transformed = data.min + "-" + data.max;
        switch (this.props.type && this.props.type.name) {
            case dpform_1.ANSWER_TYPES.TIME:
                if (this.props.onChange)
                    this.props.onChange(transformed);
                break;
            case dpform_1.ANSWER_TYPES.DATE:
                if (this.props.onChange)
                    this.props.onChange(transformed);
                break;
            case dpform_1.ANSWER_TYPES.NUMBER:
                if (this.props.onChange)
                    this.props.onChange(transformed);
                break;
            default:
                if (this.props.onChange)
                    this.props.onChange(transformed);
                break;
        }
    };
    RangeInput.prototype.render = function () {
        var _this = this;
        var comp = null;
        var type = this.props.type ? this.props.type.name : undefined;
        var parsed = this.parseRangeValue(this.props.value);
        switch (type) {
            case dpform_1.ANSWER_TYPES.TIME:
                comp = react_1.default.createElement(TimeRange, { range: parsed, onChange: this.handleInputChange });
                break;
            case dpform_1.ANSWER_TYPES.DATE:
                var dateMin = parsed.min ? new Date(parsed.min) : undefined;
                var dateMax = parsed.max ? new Date(parsed.max) : undefined;
                comp = react_1.default.createElement(datetime_1.DateRangePicker, { shortcuts: false, defaultValue: [dateMin, dateMax], onChange: function (selectedDates) { return _this.handleInputChange({ min: selectedDates[0] ? selectedDates[0].toString() : "", max: selectedDates[1] ? selectedDates[1].toString() : "" }); } });
                break;
            case dpform_1.ANSWER_TYPES.NUMBER:
                comp = react_1.default.createElement(NumberRange, { range: parsed, onChange: function (d) { return _this.handleInputChange; } });
                break;
        }
        return comp;
    };
    return RangeInput;
}(react_1.default.Component));
exports.RangeInput = RangeInput;
var defaultNumberRangeProps = {
    range: { min: "", max: "" },
    onChange: function () { }
};
var NumberRange = function (props) {
    if (props === void 0) { props = defaultNumberRangeProps; }
    var _a = react_1.useState(props ? props.range.min : ""), minValue = _a[0], setMin = _a[1];
    var _b = react_1.useState(props ? props.range.max : ""), maxValue = _b[0], setMax = _b[1];
    return (react_1.default.createElement(core_1.ButtonGroup, null,
        react_1.default.createElement("input", { className: "form-control", defaultValue: props && props.range.min && props.range.min.toString(), onChange: function (e) {
                setMin(e.target.value);
                if (props && props.onChange)
                    props.onChange({ min: minValue, max: maxValue });
            }, placeholder: "Minimum", id: "numberRange-min", type: "number" }),
        react_1.default.createElement(core_1.Divider, null),
        react_1.default.createElement("input", { className: "form-control", defaultValue: props && props.range.max && props.range.max.toString(), onChange: function (e) {
                setMax(e.target.value);
                if (props && props.onChange)
                    props.onChange({ min: minValue, max: maxValue });
            }, placeholder: "Maximum", id: "numberRange-max", type: "number" })));
};
var defaultTimeRangeProps = {
    range: {
        min: "Sat Aug 31 2019 13:35:27 GMT-0230 (Newfoundland Daylight Time",
        max: "Sat Aug 31 2019 13:35:27 GMT-0230 (Newfoundland Daylight Time"
    },
    onChange: function () { }
};
var TimeRange = function (props) {
    if (props === void 0) { props = defaultTimeRangeProps; }
    var _a = react_1.useState(props ? props.range.min : undefined), minValue = _a[0], setMin = _a[1];
    var _b = react_1.useState(props ? props.range.max : undefined), maxValue = _b[0], setMax = _b[1];
    console.log(maxValue);
    console.log(minValue);
    return (react_1.default.createElement(core_1.ButtonGroup, { className: "bp3-dark" },
        react_1.default.createElement(datetime_1.TimePicker, { precision: datetime_1.TimePrecision.MINUTE, useAmPm: true, defaultValue: minValue ? new Date(minValue) : undefined, onChange: function (newTime) {
                setMin(newTime.toLocaleDateString());
                if (props.onChange)
                    props.onChange({ min: minValue, max: maxValue });
            } }),
        react_1.default.createElement(core_1.Divider, null),
        react_1.default.createElement(datetime_1.TimePicker, { precision: datetime_1.TimePrecision.MINUTE, useAmPm: true, defaultValue: maxValue ? new Date(maxValue) : undefined, onChange: function (newTime) {
                setMax(newTime.toLocaleDateString());
                props.onChange({ min: minValue, max: maxValue });
            } })));
};
var ValInput = (function (_super) {
    __extends(ValInput, _super);
    function ValInput(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Object.defineProperty(ValInput, "defaultProps", {
        get: function () {
            return {
                defaultValue: "",
                onChange: function (e) { console.log(e); },
                type: { name: dpform_1.ANSWER_TYPES.STRING }
            };
        },
        enumerable: true,
        configurable: true
    });
    ValInput.prototype.render = function () {
        var _this = this;
        var comp = null;
        switch (this.props.type.name) {
            case dpform_1.ANSWER_TYPES.NUMBER:
                comp = react_1.default.createElement("input", { defaultValue: this.props.defaultValue, className: "form-control", type: "number", onChange: function (e) {
                        if (_this.props.onChange)
                            _this.props.onChange({ value: e.target.value });
                    } });
                break;
            case dpform_1.ANSWER_TYPES.SELECT:
                comp = react_1.default.createElement(SelInput, { type: this.props.type.ofType, defaultValue: this.props.defaultValue, options: this.props.options, onChange: function (newVal) {
                        if (_this.props.onChange)
                            _this.props.onChange(newVal);
                    } });
                break;
            case dpform_1.ANSWER_TYPES.BOOLEAN:
                var opt = [{ value: "true", label: "YES" }, { value: "false", label: "No" }];
                var def = opt.find(function (item) { return item.value === _this.props.defaultValue; });
                comp = react_1.default.createElement(react_select_1.default, { styles: DPFormItem_1.customStyles, defaultValue: def, options: opt, onChange: function (newVal) {
                        if (_this.props.onChange)
                            _this.props.onChange({ value: newVal.value });
                    } });
                break;
            case dpform_1.ANSWER_TYPES.DATE:
                var defaultDate = this.props.defaultValue ? new Date(this.props.defaultValue) : undefined;
                comp = react_1.default.createElement(datetime_1.DateInput, { formatDate: function (date) { return date.toLocaleDateString(); }, parseDate: function (str) { return new Date(str); }, closeOnSelection: true, defaultValue: defaultDate, onChange: function (e) {
                        if (_this.props.onChange)
                            _this.props.onChange({ value: e.toLocaleDateString() });
                    } });
                break;
            case dpform_1.ANSWER_TYPES.RANGE:
                if (this.props.type.ofType) {
                    comp = react_1.default.createElement(RangeInput, { value: this.props.defaultValue, type: this.props.type.ofType, onChange: function (e) {
                            if (_this.props.onChange)
                                _this.props.onChange({ value: e });
                        } });
                }
                break;
            case dpform_1.ANSWER_TYPES.STRING:
                comp = react_1.default.createElement("input", { className: "form-control", type: "text", defaultValue: this.props.defaultValue, onChange: function (e) {
                        if (_this.props.onChange)
                            _this.props.onChange({ value: e.target.value });
                    } });
                break;
            case dpform_1.ANSWER_TYPES.TIME:
                var defaulttime = this.props.defaultValue ? new Date(this.props.defaultValue) : undefined;
                comp = react_1.default.createElement(datetime_1.TimePicker, { precision: datetime_1.TimePrecision.MINUTE, useAmPm: true, defaultValue: defaulttime, onChange: function (newTime) {
                        if (_this.props.onChange)
                            _this.props.onChange({ value: newTime.toString() });
                    } });
        }
        return (comp);
    };
    return ValInput;
}(react_1.default.Component));
exports.ValInput = ValInput;
var SelInput = (function (_super) {
    __extends(SelInput, _super);
    function SelInput(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    SelInput.prototype.handleChange = function (d) {
        console.log(d);
        if (this.props.onChange)
            this.props.onChange(d);
    };
    SelInput.prototype.render = function () {
        var allOptions = [];
        if (this.props.options) {
            var _a = this.props.options.SortedOptions, rootOptions = _a.rootOptions, groups = _a.groups;
            var groupOptions_ = [];
            var rootOptions_ = [];
            if (groups && groups.length > 0) {
                groupOptions_ = groups.map(function (item) {
                    return ({
                        label: item.name,
                        options: item.members.map(function (i) { return ({ label: i.value, value: i.id }); })
                    });
                });
            }
            rootOptions_ = rootOptions.map(function (i) { return ({ label: i.value, value: i.id }); });
            allOptions = __spreadArrays(groupOptions_, rootOptions_);
        }
        var findOption = function (options_, findValue) {
            var found = null;
            for (var i = 0; i < options_.length; i++) {
                var options = options_[i];
                if (options.options && options.options.length > 0) {
                    found = options.options.find(function (item) { return item.value === findValue; });
                    if (found)
                        break;
                }
                else {
                    found = options && options.value === findValue ? options : undefined;
                    if (found)
                        break;
                }
            }
            return found;
        };
        var defaultvalue = findOption(allOptions, this.props.defaultValue);
        return (react_1.default.createElement(react_select_1.default, { styles: DPFormItem_1.customStyles, options: allOptions, onChange: this.handleChange.bind(this), defaultValue: defaultvalue }));
    };
    return SelInput;
}(react_1.default.Component));
exports.SelInput = SelInput;
