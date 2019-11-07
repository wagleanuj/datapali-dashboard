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
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var react_fontawesome_1 = require("@fortawesome/react-fontawesome");
var react_select_1 = __importDefault(require("react-select"));
var reactstrap_1 = require("reactstrap");
var getRandomId_1 = require("../utils/getRandomId");
var DPFormItem_1 = require("./DPFormItem");
var lodash_1 = __importDefault(require("lodash"));
var ValInput_1 = require("./ValInput");
var dpform_1 = require("dpform");
var TableFieldType;
(function (TableFieldType) {
    TableFieldType[TableFieldType["QuestionRef"] = 1] = "QuestionRef";
    TableFieldType[TableFieldType["ComparisonOperator"] = 2] = "ComparisonOperator";
    TableFieldType[TableFieldType["ComparisonValue"] = 3] = "ComparisonValue";
    TableFieldType[TableFieldType["FollowingOperator"] = 4] = "FollowingOperator";
})(TableFieldType || (TableFieldType = {}));
var CreateCondition = (function (_super) {
    __extends(CreateCondition, _super);
    function CreateCondition(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            literals: _this.props.condition ? _this.props.condition.literals : [],
        };
        _this.columns = [
            {
                dataField: "id",
                text: "Literal ID"
            },
            {
                dataField: "questionRef",
                text: "Question Reference"
            },
            {
                dataField: "comparisonOperator",
                text: "Comparison Operator"
            },
            {
                dataField: "comparisonValue",
                text: "Comparison Value"
            },
            {
                dataField: "followingOperator",
                text: "Following Operator"
            }
        ];
        return _this;
    }
    Object.defineProperty(CreateCondition, "defaultProps", {
        get: function () {
            return {
                onChange: function () { },
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    CreateCondition.prototype.componentDidMount = function () {
        if (this.props.setLiteralsSetter) {
            this.props.setLiteralsSetter(this.setLiterals.bind(this));
        }
    };
    CreateCondition.prototype.setLiterals = function (newLiterals) {
        this.setState({
            literals: newLiterals
        });
    };
    CreateCondition.prototype.addLiteral = function (literal) {
        var _this = this;
        if (!literal)
            literal = { literalId: getRandomId_1.getRandomId("lit-"), questionRef: undefined, comparisonOperator: undefined, comparisonValue: undefined, followingOperator: undefined };
        this.setState(function (prevState) {
            var newLiterals = lodash_1.default.clone(prevState.literals);
            if (literal)
                newLiterals.push(literal);
            return { literals: newLiterals };
        }, function () {
            if (_this.props.onChange) {
                _this.props.onChange(_this.state.literals);
            }
        });
    };
    CreateCondition.prototype.moveLiteralUp = function (index) {
        this.setState(function (prevState) {
            var _a;
            var newLiterals = lodash_1.default.clone(prevState.literals);
            var get_new_index = function (i, length) {
                var mod = function (x, n) { return (x % n + n) % n; };
                return mod(i - 1, length);
            };
            var newIndex = get_new_index(index, newLiterals.length);
            _a = [newLiterals[newIndex], newLiterals[index]], newLiterals[index] = _a[0], newLiterals[newIndex] = _a[1];
            return {
                literals: newLiterals
            };
        }, this.forceUpdate.bind(this));
    };
    CreateCondition.prototype.handleDataChange = function (literalIndex, valueField, newValue) {
        var _this = this;
        this.setState(function (prevState) {
            var newLiterals = lodash_1.default.clone(prevState.literals);
            var current = newLiterals[literalIndex];
            switch (valueField) {
                case TableFieldType.QuestionRef:
                    current.questionRef = newValue && newValue.value ? newValue.value : undefined;
                    break;
                case TableFieldType.ComparisonOperator:
                    var prop = void 0;
                    var accessProp = void 0;
                    for (prop in dpform_1.QAComparisonOperator) {
                        if (dpform_1.QAComparisonOperator[prop] === newValue.value) {
                            accessProp = prop;
                            current.comparisonOperator = dpform_1.QAComparisonOperator[accessProp];
                            break;
                        }
                    }
                    break;
                case TableFieldType.ComparisonValue:
                    var newComparisonValue = { content: newValue.value, type: dpform_1.QAType.String };
                    current.comparisonValue = newComparisonValue;
                    break;
                case TableFieldType.FollowingOperator:
                    current.followingOperator = (newValue.value === dpform_1.QAFollowingOperator.AND) ? dpform_1.QAFollowingOperator.AND : dpform_1.QAFollowingOperator.OR;
                    break;
                default:
                    break;
            }
            return {
                literals: newLiterals
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.literals);
        });
    };
    CreateCondition.prototype.getQuestion = function (questionRef) {
        if (questionRef && this.props.definedQuestions && !lodash_1.default.isEmpty(this.props.definedQuestions)) {
            var v = this.props.definedQuestions[questionRef];
            return v;
        }
        return null;
    };
    CreateCondition.prototype.removeLiteral = function (index) {
        var _this = this;
        this.setState(function (prevState) {
            var newLiterals = lodash_1.default.clone(prevState.literals);
            newLiterals.splice(index, 1);
            return {
                literals: newLiterals
            };
        }, function () {
            if (_this.props.onChange) {
                _this.props.onChange(_this.state.literals);
            }
        });
    };
    CreateCondition.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(reactstrap_1.Card, null,
            react_1.default.createElement(reactstrap_1.CardHeader, null, (this.props.condition ? "Edit" : "Add") + " Condtion"),
            react_1.default.createElement(reactstrap_1.CardBody, null,
                react_1.default.createElement(reactstrap_1.Row, null,
                    react_1.default.createElement(reactstrap_1.Table, null,
                        react_1.default.createElement("thead", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("th", { key: "th-first" }, ""),
                                this.columns.map(function (item, key) {
                                    return react_1.default.createElement("th", { key: key }, item.text);
                                }),
                                react_1.default.createElement("th", { key: "th-last" }, ""))),
                        react_1.default.createElement("tbody", null,
                            this.state.literals.map(function (item, key) {
                                var questions_ = _this.props.definedQuestions ? Object.values(_this.props.definedQuestions).map(function (item) { return ({ value: item.id, label: item.questionContent.content }); }) : [];
                                var questionselect = react_1.default.createElement(react_select_1.default, { key: "literalq-" + key + "-" + item.literalId, styles: DPFormItem_1.customStyles, options: questions_, value: questions_.find(function (r) { return r.value === item.questionRef; }), onChange: function (selecteOption) { return _this.handleDataChange(key, TableFieldType.QuestionRef, selecteOption); } });
                                var selectedQuestionType = item.questionRef && _this.props.definedQuestions && _this.props.definedQuestions[item.questionRef] ? _this.props.definedQuestions[item.questionRef].answerType : undefined;
                                var comparisionOPOptions_ = DPFormItem_1.getOperatorForType(selectedQuestionType).map(function (val, index) { return ({ value: val, label: val }); });
                                var comparisonOpSelect = react_1.default.createElement(react_select_1.default, { key: "literalo-" + key + "-" + item.literalId, styles: DPFormItem_1.customStyles, options: comparisionOPOptions_, value: comparisionOPOptions_.find(function (op, index) { return op.value === item.comparisonOperator; }), onChange: _this.handleDataChange.bind(_this, key, TableFieldType.ComparisonOperator) });
                                var question_ = _this.getQuestion(item.questionRef);
                                var qAnswerType = question_ ? question_.answerType : undefined;
                                var qOptions = question_ && question_.options ? question_.options : undefined;
                                var comparisonValueSelect = react_1.default.createElement(ValInput_1.ValInput, { options: qOptions, key: "literalv-" + key + "-" + item.literalId, onChange: _this.handleDataChange.bind(_this, key, TableFieldType.ComparisonValue), defaultValue: item.comparisonValue && item.comparisonValue.content, type: qAnswerType });
                                var followingOperatorOptions_ = Object.keys(dpform_1.QAFollowingOperator).map(function (key) { return ({ label: key, value: key === "AND" ? dpform_1.QAFollowingOperator.AND : key === "OR" ? dpform_1.QAFollowingOperator.OR : "" }); });
                                var followingOperatorSelect = react_1.default.createElement(react_select_1.default, { key: "literalfo-" + key + "-" + item.literalId, styles: DPFormItem_1.customStyles, options: followingOperatorOptions_, value: followingOperatorOptions_.find(function (r) { return r.value === item.followingOperator; }), onChange: _this.handleDataChange.bind(_this, key, TableFieldType.FollowingOperator) });
                                return react_1.default.createElement("tr", { key: "tr_" + key },
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement(reactstrap_1.Button, { type: "button", size: "sm", onClick: function () { return _this.moveLiteralUp(key); } },
                                            react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faArrowUp }))),
                                    react_1.default.createElement("td", null,
                                        "l",
                                        react_1.default.createElement("sub", null, key)),
                                    react_1.default.createElement("td", { className: "questionRef" }, questionselect),
                                    react_1.default.createElement("td", { className: "comparisonOperator" }, comparisonOpSelect),
                                    react_1.default.createElement("td", { className: "comparisonValue" }, comparisonValueSelect),
                                    react_1.default.createElement("td", { className: "followingOperator" }, followingOperatorSelect),
                                    react_1.default.createElement("td", null,
                                        react_1.default.createElement(reactstrap_1.Button, { size: "sm", onClick: function () { _this.removeLiteral(key); } },
                                            " ",
                                            react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faWindowClose }))));
                            }),
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("td", null,
                                    react_1.default.createElement(reactstrap_1.Button, { size: "sm", onClick: function () { return _this.addLiteral(); }, type: "button" },
                                        react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: free_solid_svg_icons_1.faPlusSquare }))),
                                react_1.default.createElement("td", null),
                                react_1.default.createElement("td", null),
                                react_1.default.createElement("td", null),
                                react_1.default.createElement("td", null),
                                react_1.default.createElement("td", null),
                                react_1.default.createElement("td", null))))))));
    };
    return CreateCondition;
}(react_1.default.Component));
exports.CreateCondition = CreateCondition;
