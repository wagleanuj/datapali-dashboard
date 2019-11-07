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
var reactstrap_1 = require("reactstrap");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var utils_1 = require("../utils");
var CreateConditionModal_1 = require("./CreateConditionModal");
var lodash_1 = __importDefault(require("lodash"));
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var ValInput_1 = require("./ValInput");
var core_1 = require("@blueprintjs/core");
var dpform_1 = require("dpform");
var AutofillCondition = (function (_super) {
    __extends(AutofillCondition, _super);
    function AutofillCondition(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            aConditions: _this.props.autoAnswer.answeringConditions || [],
            isEnabled: _this.props.autoAnswer.isEnabled
        };
        return _this;
    }
    AutofillCondition.prototype.editIfTrueFalseValue = function (type, index, value) {
        var _this = this;
        this.setState(function (prevState) {
            var found = undefined;
            var newConditions = lodash_1.default.clone(prevState.aConditions);
            var selected = newConditions[index];
            if (_this.props.options && _this.props.answerType.name === dpform_1.ANSWER_TYPES.SELECT) {
                found = _this.props.options.optionsMap[value];
                if (type === "true") {
                    selected.ifTrue = found.id;
                }
                else if (type === "false") {
                    selected.ifFalse = found.id;
                }
            }
            else {
                if (type === 'true')
                    selected.ifTrue = value;
                if (type === 'false')
                    selected.ifFalse = value;
            }
            return {
                aConditions: newConditions
            };
        }, function () {
            if (_this.props.onChange) {
                _this.props.onChange({ isEnabled: _this.state.isEnabled, answeringConditions: _this.state.aConditions });
            }
        });
    };
    AutofillCondition.prototype.openConditionModal = function (index) {
        var condition = this.state.aConditions[index];
        var el = react_1.default.createElement(CreateConditionModal_1.CreateConditionModal, { definedQuestions: this.props.definedQuestions, isOpen: true, onSubmit: this.editCondition.bind(this, index), onCancel: utils_1.destroyModal.bind(this), condition: condition.condition });
        utils_1.openModal(el);
    };
    AutofillCondition.prototype.changeEnabled = function () {
        var _this = this;
        this.setState(function (prevState) {
            return {
                isEnabled: !prevState.isEnabled
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange({ isEnabled: _this.state.isEnabled, answeringConditions: _this.state.aConditions });
        });
    };
    AutofillCondition.prototype.addAutoFillCondition = function () {
        var _this = this;
        this.setState(function (prevState) {
            var newConditions = lodash_1.default.clone(prevState.aConditions);
            var answerCondition = {
                condition: new dpform_1.QACondition(),
                ifTrue: undefined,
                ifFalse: undefined
            };
            newConditions.push(answerCondition);
            return {
                aConditions: newConditions
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange({ isEnabled: _this.state.isEnabled, answeringConditions: _this.state.aConditions });
        });
    };
    AutofillCondition.prototype.editCondition = function (index, data) {
        var _this = this;
        var cloned = lodash_1.default.clone(this.state.aConditions);
        var condition = cloned[index].condition;
        if (!condition) {
            cloned[index].condition = new dpform_1.QACondition();
        }
        cloned[index].condition.setLiterals(data);
        this.setState({
            aConditions: cloned
        }, function () {
            utils_1.destroyModal();
            if (_this.props.onChange)
                _this.props.onChange({ isEnabled: _this.state.isEnabled, answeringConditions: _this.state.aConditions });
        });
    };
    AutofillCondition.prototype.removeAutofillCondition = function (index) {
        var _this = this;
        this.setState(function (prevState) {
            var aConditions = lodash_1.default.clone(prevState.aConditions);
            aConditions.splice(index, 1);
            return {
                aConditions: aConditions
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange({ isEnabled: _this.state.isEnabled, answeringConditions: _this.state.aConditions });
        });
    };
    AutofillCondition.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(core_1.Switch, { checked: this.state.isEnabled, onChange: this.changeEnabled.bind(this), label: "Enabled" }),
            react_1.default.createElement(reactstrap_1.Table, null,
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null),
                        react_1.default.createElement("th", null, "Condition"),
                        react_1.default.createElement("th", null, " if True"),
                        react_1.default.createElement("th", null, " if False"),
                        react_1.default.createElement("th", null))),
                react_1.default.createElement("tbody", null,
                    this.state.aConditions.map(function (item, index) {
                        var comparisonValueSelect = function (ifFalseOrTrue) { return react_1.default.createElement(ValInput_1.ValInput, { key: ifFalseOrTrue, onChange: function (data) { return _this.editIfTrueFalseValue(ifFalseOrTrue, index, data.value); }, options: _this.props.options, defaultValue: ifFalseOrTrue === "true" ? item.ifTrue : (item.ifFalse && item.ifFalse), type: _this.props.answerType }); };
                        return (react_1.default.createElement("tr", { key: "af" + index },
                            react_1.default.createElement("td", null),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement(reactstrap_1.Button, { type: "button", onClick: function () { return _this.openConditionModal(index); }, size: "sm" },
                                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { size: "sm", icon: free_solid_svg_icons_1.faKey }))),
                            react_1.default.createElement("td", null, comparisonValueSelect("true")),
                            react_1.default.createElement("td", null, comparisonValueSelect("false")),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement(reactstrap_1.Button, { size: "sm", onClick: function () { _this.removeAutofillCondition(index); } },
                                    " ",
                                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faWindowClose })))));
                    }),
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(reactstrap_1.Button, { size: "sm", onClick: function () { return _this.addAutoFillCondition(); }, type: "button" },
                                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faPlusSquare }))),
                        react_1.default.createElement("td", null),
                        react_1.default.createElement("td", null),
                        react_1.default.createElement("td", null),
                        react_1.default.createElement("td", null))))));
    };
    return AutofillCondition;
}(react_1.default.Component));
exports.AutofillCondition = AutofillCondition;
