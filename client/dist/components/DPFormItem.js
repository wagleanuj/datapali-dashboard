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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var formik_1 = require("formik");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var _ = __importStar(require("lodash"));
var reactstrap_1 = require("reactstrap");
var react_modal_1 = __importDefault(require("react-modal"));
var utils_1 = require("../utils");
var AutofillCondition_1 = require("./AutofillCondition");
var CreateConditionModal_1 = require("./CreateConditionModal");
var core_1 = require("@blueprintjs/core");
var dpform_1 = require("dpform");
var AnswerType_1 = require("./AnswerType");
var AddOptions_1 = require("./AddOptions");
var root = document.getElementById("root") || document.body;
react_modal_1.default.setAppElement(root);
function getOperatorForType(valueType) {
    var allOperators = Object.values(dpform_1.QAComparisonOperator);
    var type = valueType && valueType.name;
    switch (type) {
        case dpform_1.ANSWER_TYPES.BOOLEAN:
        case dpform_1.ANSWER_TYPES.DATE:
        case dpform_1.ANSWER_TYPES.STRING:
        case dpform_1.ANSWER_TYPES.TIME:
            return allOperators.filter(function (item) { return item === dpform_1.QAComparisonOperator.Equal; });
        case dpform_1.ANSWER_TYPES.NUMBER:
        default:
            return allOperators;
    }
}
exports.getOperatorForType = getOperatorForType;
exports.customStyles = {
    container: function (base, state) { return (__assign(__assign({}, base), { border: state.isFocused ? null : null, background: "transparent", transition: "border-color 0.2s ease, box-shadow 0.2s ease, padding 0.2s ease", "&:hover": {
            boxShadow: "0 2px 4px 0 rgba(41, 56, 78, 0.1)",
        } })); },
    control: function (base, state) { return (__assign(__assign({}, base), { background: "transparent", borderColor: state.isFocused ? brandColor : base.borderColor, '&:hover': {
            borderColor: state.isFocused
                ? brandColor
                : base.borderColor
        } })); },
    valueContainer: function (base, state) { return (__assign(__assign({}, base), { background: "transparent", color: "white" })); },
    menu: function (base, state) { return (__assign(__assign({}, base), { background: "black", borderColor: "#e14eca", zIndex: "999999999999999999 !important" })); },
    menuList: function (base, state) {
        console.log(state);
        return __assign(__assign({}, base), { background: "#525f7f", color: "white" });
    },
    singleValue: function (base, state) { return (__assign(__assign({}, base), { color: "white" })); },
    input: function (base, state) { return (__assign(__assign({}, base), { color: "white" })); },
    option: function (base, state) { return (__assign(__assign({}, base), { background: state.isSelected ? "lightblue" : state.isFocused ? "hotpink" : "#525f7f" })); },
};
var brandColor = '#46beed';
var DPFormItem = (function (_super) {
    __extends(DPFormItem, _super);
    function DPFormItem(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            question: _this.props.question
        };
        return _this;
    }
    DPFormItem.prototype.handleChange = function () {
        if (this.props.onChange)
            this.props.onChange(this.state.question);
    };
    DPFormItem.prototype.handleRequiredChange = function (e) {
        this.setState(function (prevState) {
            var question = _.clone(prevState.question);
            question.setIsRequired(!question.isRequired);
            return {
                question: question
            };
        }, this.handleChange.bind(this));
    };
    DPFormItem.prototype.openAppearingConditionModal = function () {
        var el = react_1.default.createElement(CreateConditionModal_1.CreateConditionModal, { definedQuestions: this.props.definedQuestions, isOpen: true, onSubmit: this.editAppearingCondition.bind(this), onCancel: utils_1.destroyModal.bind(this), condition: this.state.question.appearingCondition });
        utils_1.openModal(el);
    };
    DPFormItem.prototype.editAppearingCondition = function (newLiterals) {
        var _this = this;
        this.setState(function (prevState) {
            var question = _.clone(prevState.question);
            if (!question.appearingCondition)
                question.setAppearingCondition(new dpform_1.QACondition());
            question.appearingCondition.setLiterals(newLiterals);
            console.log(dpform_1.QACondition.toJSON(question.appearingCondition));
            return {
                question: question
            };
        }, function () {
            utils_1.destroyModal();
            _this.handleChange();
        });
    };
    DPFormItem.prototype.handleQuestionChange = function (e) {
        this.setState(function (prevState) {
            var question = _.clone(prevState.question);
            question.setQuestionContent({ type: dpform_1.QAType.String, content: e });
            return {
                question: question
            };
        }, this.handleChange.bind(this));
    };
    DPFormItem.prototype.handleAnswerTypeChange = function (type) {
        this.setState(function (prevState) {
            var question = _.clone(prevState.question);
            question.setAnswerType(type);
            return {
                question: question
            };
        }, this.handleChange.bind(this));
    };
    DPFormItem.prototype.handleOptionsChange = function (options) {
        this.setState(function (prevState) {
            var question = _.clone(prevState.question);
            question.setOptions(options);
            return {
                question: question
            };
        }, this.handleChange.bind(this));
    };
    DPFormItem.prototype.handleAutoFillChange = function (autoanswer) {
        this.setState(function (prevState) {
            var cloned = _.clone(prevState.question);
            cloned.setAutoAnswer(autoanswer);
            return {
                question: cloned
            };
        }, this.handleChange.bind(this));
    };
    DPFormItem.prototype.handleCustomIdChange = function (newId) {
        this.setState(function (prevState) {
            var cloned = _.clone(prevState.question);
            cloned.customId = newId;
            return {
                question: cloned
            };
        }, this.handleChange.bind(this));
    };
    DPFormItem.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(formik_1.Form, null,
            react_1.default.createElement("div", null,
                react_1.default.createElement(reactstrap_1.Card, null,
                    react_1.default.createElement(reactstrap_1.CardHeader, null,
                        react_1.default.createElement("h5", { className: "title" }, "Add Question")),
                    react_1.default.createElement(reactstrap_1.CardBody, null,
                        react_1.default.createElement(reactstrap_1.FormGroup, null,
                            react_1.default.createElement("label", { htmlFor: "customid" }, "Custom ID"),
                            react_1.default.createElement("input", { defaultValue: this.state.question.customId, className: "form-control", onChange: function (e) { return _this.handleCustomIdChange(e.target.value); }, id: "custom_id", name: "custom_id", placeholder: "Custom id" })),
                        react_1.default.createElement(reactstrap_1.FormGroup, null,
                            react_1.default.createElement("label", { htmlFor: "question" }, "Question"),
                            react_1.default.createElement("textarea", { defaultValue: this.state.question.questionContent.content, className: "form-control", onChange: function (e) { return _this.handleQuestionChange(e.target.value); }, id: "question", name: "question", placeholder: "" })),
                        react_1.default.createElement(reactstrap_1.FormGroup, null,
                            react_1.default.createElement(core_1.Switch, { defaultChecked: this.state.question.isRequired, label: "Required", onChange: this.handleRequiredChange.bind(this) })),
                        react_1.default.createElement(reactstrap_1.FormGroup, null,
                            react_1.default.createElement(AnswerType_1.AnswerTypeInput, { answerType: this.state.question.answerType, onChange: this.handleAnswerTypeChange.bind(this) })),
                        this.state.question.answerType && this.state.question.answerType.name === dpform_1.ANSWER_TYPES.SELECT && this.state.question.answerType.ofType && react_1.default.createElement(reactstrap_1.FormGroup, null,
                            react_1.default.createElement("label", null, "Add Options"),
                            react_1.default.createElement(reactstrap_1.Card, null,
                                react_1.default.createElement(AddOptions_1.QAAddOptions, { constants: this.props.constants, definedQuestions: this.props.definedQuestions, onChange: this.handleOptionsChange.bind(this), defaultOptionType: this.state.question.answerType, options: this.state.question.options }))),
                        react_1.default.createElement(reactstrap_1.FormGroup, null,
                            react_1.default.createElement("label", { htmlFor: "type" }, "Appearing Condition"),
                            react_1.default.createElement("div", null,
                                react_1.default.createElement(reactstrap_1.Button, { type: "button", onClick: this.openAppearingConditionModal.bind(this), size: "sm" },
                                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { size: "sm", icon: free_solid_svg_icons_1.faKey })))),
                        react_1.default.createElement(reactstrap_1.FormGroup, null,
                            react_1.default.createElement(reactstrap_1.FormGroup, null,
                                react_1.default.createElement("label", { htmlFor: "type" }, "Add Autofill Conditions"),
                                react_1.default.createElement(AutofillCondition_1.AutofillCondition, { autoAnswer: this.state.question.autoAnswer, definedQuestions: this.props.definedQuestions, onChange: this.handleAutoFillChange.bind(this), answerType: this.state.question.answerType, options: this.state.question.options }))))))));
    };
    DPFormItem.defaultProps = {
        question: new dpform_1.QAQuestion()
    };
    return DPFormItem;
}(react_1.default.Component));
exports.DPFormItem = DPFormItem;
