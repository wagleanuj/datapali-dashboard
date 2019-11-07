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
var core_1 = require("@blueprintjs/core");
var dpform_1 = require("dpform");
var lodash_1 = __importDefault(require("lodash"));
var react_1 = __importDefault(require("react"));
var react_select_1 = __importDefault(require("react-select/"));
var creatable_1 = __importDefault(require("react-select/creatable"));
var reactstrap_1 = require("reactstrap");
var utils_1 = require("../utils");
var AnswerType_1 = require("./AnswerType");
var CreateConditionModal_1 = require("./CreateConditionModal");
var DPFormItem_1 = require("./DPFormItem");
var ValInput_1 = require("./ValInput");
var OPTION_OR_GROUP;
(function (OPTION_OR_GROUP) {
    OPTION_OR_GROUP[OPTION_OR_GROUP["OPTION"] = 1] = "OPTION";
    OPTION_OR_GROUP[OPTION_OR_GROUP["GROUP"] = 2] = "GROUP";
})(OPTION_OR_GROUP || (OPTION_OR_GROUP = {}));
var QAAddOptions = (function (_super) {
    __extends(QAAddOptions, _super);
    function QAAddOptions(props) {
        var _this = _super.call(this, props) || this;
        _this.constantNameInputRef = null;
        _this.makeFromTextInputRef = null;
        _this.state = {
            options: _this.props.options || new dpform_1.AnswerOptions()
        };
        return _this;
    }
    QAAddOptions.prototype.makeConstant = function () {
        var name = 'const';
        if (this.constantNameInputRef) {
            name = this.constantNameInputRef.value;
        }
        this.props.constants.addConstant({
            id: dpform_1.getRandomId('const-'),
            name: name,
            type: { name: dpform_1.ANSWER_TYPES.SELECT, ofType: { name: dpform_1.ANSWER_TYPES.STRING } },
            value: dpform_1.AnswerOptions.fromJSON(dpform_1.AnswerOptions.toJSON((this.state.options)))
        });
    };
    QAAddOptions.prototype.makeOptionsFromText = function () {
        var _this = this;
        if (this.makeFromTextInputRef) {
            var text = this.makeFromTextInputRef.value;
            var optionsText_1 = text.split("\n");
            this.setState(function (prevState) {
                var options = lodash_1.default.clone(prevState.options);
                optionsText_1.forEach(function (item) {
                    options.addOption({
                        id: "opt-" + Object.keys(options.optionsMap).length,
                        appearingCondition: undefined,
                        groupName: undefined,
                        type: _this.props.defaultOptionType.ofType,
                        value: item,
                    });
                });
                return {
                    options: options
                };
            });
        }
    };
    QAAddOptions.prototype.handleChange = function () {
        if (this.props.onChange)
            this.props.onChange(this.state.options);
    };
    QAAddOptions.prototype.handleAddNewOption = function () {
        var _this = this;
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            var newOption = {
                id: "opt-" + Object.keys(prevState.options.optionsMap).length,
                appearingCondition: undefined,
                groupName: undefined,
                type: _this.props.defaultOptionType.ofType,
                value: undefined
            };
            cloned.addOption(newOption);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleGroupNameChange = function (oldname, newname) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.changeGroupName(oldname, newname);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleGroupDelete = function (name) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.deleteGroup(name);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleOptionTypeChange = function (id, newType) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.setOptionTypeFor(id, newType);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleGroupAssignment = function (ids, groupname) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.assignOptionToGroup(ids, groupname);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleGroupUnassignment = function (ids) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.unassignGroup(ids);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleOptionDelete = function (id) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.deleteOption(id);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleOptionValueChange = function (id, newValue) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.setValueForOption(id, newValue);
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleAddGroup = function () {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            cloned.addGroup();
            return {
                options: cloned
            };
        }, this.handleChange.bind(this));
    };
    QAAddOptions.prototype.handleConditionClick = function (type, name) {
        var condition;
        if (type === OPTION_OR_GROUP.GROUP) {
            condition = this.state.options.optionGroupMap[name].appearingCondition;
        }
        else {
            condition = this.state.options.optionsMap[name].appearingCondition;
        }
        var el = react_1.default.createElement(CreateConditionModal_1.CreateConditionModal, { definedQuestions: this.props.definedQuestions, isOpen: true, onSubmit: this.setCondition.bind(this, name, type), onCancel: utils_1.destroyModal.bind(this), condition: condition });
        utils_1.openModal(el);
    };
    QAAddOptions.prototype.setCondition = function (idOrname, type, literals) {
        var _this = this;
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.options);
            if (type === OPTION_OR_GROUP.GROUP) {
                var group = cloned.optionGroupMap[idOrname];
                if (!group.appearingCondition) {
                    group.appearingCondition = new dpform_1.QACondition();
                }
                group.appearingCondition.setLiterals(literals);
            }
            else if (type === OPTION_OR_GROUP.OPTION) {
                var option = cloned.optionsMap[idOrname];
                if (!option.appearingCondition)
                    option.appearingCondition = new dpform_1.QACondition();
                option.appearingCondition.setLiterals(literals);
            }
            return {
                options: cloned
            };
        }, function () {
            utils_1.destroyModal();
            _this.handleChange();
        });
    };
    QAAddOptions.prototype.handleImportFromConstant = function (a) {
        var constant = this.props.constants.getConstant(a.value);
        console.log(a);
        console.log(constant);
        if (constant && constant.value instanceof dpform_1.AnswerOptions) {
            this.setState({
                options: dpform_1.AnswerOptions.fromJSON(dpform_1.AnswerOptions.toJSON(constant.value))
            }, this.handleChange.bind(this));
        }
    };
    QAAddOptions.prototype.render = function () {
        var _this = this;
        var constantsOptions = this.props.constants.ConstantsArray.map(function (item) { return ({ label: item.name, value: item.id }); });
        return (react_1.default.createElement(core_1.ButtonGroup, { fill: true, vertical: true },
            react_1.default.createElement(core_1.H5, null, "Import From Constant "),
            react_1.default.createElement(react_select_1.default, { styles: DPFormItem_1.customStyles, options: constantsOptions, onChange: this.handleImportFromConstant.bind(this) }),
            react_1.default.createElement(core_1.Divider, null),
            react_1.default.createElement(core_1.H5, null, "Export To Constant"),
            react_1.default.createElement("input", { type: "text", ref: function (r) { return _this.constantNameInputRef = r; } }),
            react_1.default.createElement(core_1.Button, { onClick: this.makeConstant.bind(this) }, "Export"),
            react_1.default.createElement(core_1.Divider, null),
            react_1.default.createElement(core_1.H5, null, "Make From Text"),
            react_1.default.createElement("textarea", { ref: function (r) { return _this.makeFromTextInputRef = r; } }),
            react_1.default.createElement(core_1.Button, { onClick: this.makeOptionsFromText.bind(this) }, "Make From Text"),
            react_1.default.createElement(QAOptionSection, { defaultType: this.props.defaultOptionType, groups: this.state.options.optionGroupMap ? Object.values(this.state.options.optionGroupMap) : [], handleGroupAssignment: this.handleGroupAssignment.bind(this), handleOptionTypeChange: this.handleOptionTypeChange.bind(this), handleAddNewOption: this.handleAddNewOption.bind(this), handleOptionDelete: this.handleOptionDelete.bind(this), handleConditionClick: this.handleConditionClick.bind(this, OPTION_OR_GROUP.OPTION), handleOptionValueChange: this.handleOptionValueChange.bind(this), options: this.state.options.optionsMap ? Object.values(this.state.options.optionsMap) : [] }),
            react_1.default.createElement(core_1.Divider, null),
            react_1.default.createElement(QAAddGroupSection, { handleAddGroup: this.handleAddGroup.bind(this), handleGroupUnassignment: this.handleGroupUnassignment.bind(this), handleGroupAssignment: this.handleGroupAssignment.bind(this), handleGroupNameChange: this.handleGroupNameChange.bind(this), handleGroupDelete: this.handleGroupDelete.bind(this), handleGroupConditionClick: this.handleConditionClick.bind(this, OPTION_OR_GROUP.GROUP), options: this.state.options.optionsMap ? Object.values(this.state.options.optionsMap) : [], groups: this.state.options.optionGroupMap ? Object.values(this.state.options.optionGroupMap) : [] })));
    };
    return QAAddOptions;
}(react_1.default.Component));
exports.QAAddOptions = QAAddOptions;
var QAOptionSection = (function (_super) {
    __extends(QAOptionSection, _super);
    function QAOptionSection(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            options: _this.props.options
        };
        return _this;
    }
    QAOptionSection.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (nextProps.options.length !== this.props.options.length || nextProps.groups.length !== this.props.groups.length) {
            return true;
        }
        return false;
    };
    QAOptionSection.prototype.generateAddGroupInput = function (option) {
        var _this = this;
        var creatableOptions = this.props.groups.map(function (item) { return ({ value: item.name, label: item.name }); });
        var value = creatableOptions.find(function (item) { return item.value === option.groupName; });
        return react_1.default.createElement(creatable_1.default, { value: value || null, styles: DPFormItem_1.customStyles, options: creatableOptions, onChange: function (e) {
                if (_this.props.handleGroupAssignment)
                    _this.props.handleGroupAssignment([option.id], e.value);
            } });
    };
    QAOptionSection.prototype.handleAddNewOption = function () {
        if (this.props.handleAddNewOption)
            this.props.handleAddNewOption();
    };
    QAOptionSection.prototype.handleConditionEdit = function (id) {
        if (this.props.handleConditionClick)
            this.props.handleConditionClick(id);
    };
    QAOptionSection.prototype.handleAddGroupInput = function (index) {
    };
    QAOptionSection.prototype.handleOptionDelete = function (id) {
        if (this.props.handleOptionDelete)
            this.props.handleOptionDelete(id);
    };
    QAOptionSection.prototype.handleOptionTypeChange = function (option_id, newType) {
        if (this.props.handleOptionTypeChange)
            this.props.handleOptionTypeChange(option_id, newType);
    };
    QAOptionSection.prototype.handleOptionValueChange = function (id, newValue) {
        if (this.props.handleOptionValueChange)
            this.props.handleOptionValueChange(id, newValue.value);
    };
    QAOptionSection.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(reactstrap_1.Table, null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null),
                    react_1.default.createElement("th", null, "Id"),
                    react_1.default.createElement("th", null, "Type"),
                    react_1.default.createElement("th", null, "Value"),
                    react_1.default.createElement("th", null, "Condition"),
                    react_1.default.createElement("th", null, "Group"),
                    react_1.default.createElement("th", null))),
            react_1.default.createElement("tbody", null,
                this.props.options.map(function (item, i) {
                    return react_1.default.createElement("tr", { key: item.id },
                        react_1.default.createElement("td", null),
                        react_1.default.createElement("td", null, item.id),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(AnswerType_1.AnswerTypeInput, { answerType: item.type, onChange: function (e) { return _this.handleOptionTypeChange(item.id, e); } })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(ValInput_1.ValInput, { onChange: _this.handleOptionValueChange.bind(_this, item.id), defaultValue: item.value, type: item.type })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(core_1.Button, { onClick: _this.handleConditionEdit.bind(_this, item.id), style: { color: 'red', width: 20 }, icon: "key" })),
                        react_1.default.createElement("td", null, _this.generateAddGroupInput(item)),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(core_1.Button, { style: { width: 20 }, onClick: _this.handleOptionDelete.bind(_this, item.id), icon: "cross" })));
                }),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Button, { style: { width: 20 }, icon: "add", onClick: this.handleAddNewOption.bind(this) })),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null)))));
    };
    QAOptionSection.defaultProps = {
        options: [],
        groups: []
    };
    return QAOptionSection;
}(react_1.default.Component));
exports.QAOptionSection = QAOptionSection;
var QAAddGroupSection = (function (_super) {
    __extends(QAAddGroupSection, _super);
    function QAAddGroupSection(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    QAAddGroupSection.prototype.handleGroupAssignment = function (e, groupname) {
        if (e) {
            var ids = e.map(function (item) { return item.value; });
            console.log(ids);
            if (this.props.handleGroupAssignment)
                this.props.handleGroupAssignment(ids, groupname);
        }
    };
    QAAddGroupSection.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(reactstrap_1.Table, null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("th", null),
                    react_1.default.createElement("th", null, "Group Name"),
                    react_1.default.createElement("th", null, "Group Items"),
                    react_1.default.createElement("th", null, "Appearing Condition"),
                    react_1.default.createElement("th", null))),
            react_1.default.createElement("tbody", null,
                this.props.groups.map(function (item, index) {
                    var options = _this.props.options.map(function (item) { return ({ value: item.id, label: item.id }); });
                    var memberids = item.members.map(function (item) { return item.id; });
                    var selected = options.filter(function (item) { return memberids.includes(item.value); });
                    return react_1.default.createElement("tr", { key: item.id },
                        react_1.default.createElement("td", null),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("input", { key: item.id, type: "text", className: "form-control", defaultValue: item.name, onChange: function (e) {
                                    if (_this.props.handleGroupNameChange)
                                        _this.props.handleGroupNameChange(item.name, e.target.value);
                                } })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(react_select_1.default, { styles: DPFormItem_1.customStyles, onChange: function (e, action) {
                                    if (action.action === "remove-value") {
                                        var removedid = action.removedValue.value;
                                        if (_this.props.handleGroupUnassignment)
                                            _this.props.handleGroupUnassignment([removedid]);
                                    }
                                    _this.handleGroupAssignment(e, item.name);
                                }, value: selected, isMulti: true, options: options })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(core_1.Button, { style: { width: 20 }, icon: "key", onClick: function () {
                                    if (_this.props.handleGroupConditionClick)
                                        _this.props.handleGroupConditionClick(item.name);
                                } })),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement(core_1.Button, { style: { width: 20 }, icon: "cross", onClick: function () {
                                    if (_this.props.handleGroupDelete)
                                        _this.props.handleGroupDelete(item.name);
                                } })));
                }),
                react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", null,
                        react_1.default.createElement(core_1.Button, { style: { width: 20 }, icon: "add", onClick: function () {
                                if (_this.props.handleAddGroup)
                                    _this.props.handleAddGroup();
                            } })),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null),
                    react_1.default.createElement("td", null)))));
    };
    return QAAddGroupSection;
}(react_1.default.Component));
exports.QAAddGroupSection = QAAddGroupSection;
