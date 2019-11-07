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
var copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
var dpform_1 = require("dpform");
var lodash_1 = __importDefault(require("lodash"));
var react_1 = __importDefault(require("react"));
var reactstrap_1 = require("reactstrap");
var APPCONFIG_1 = require("../APPCONFIG");
var constants_1 = require("./constants");
var formtree_1 = require("./formtree");
var section_1 = require("./section");
var Toolbar_1 = require("./Toolbar");
var SurveyForm = (function (_super) {
    __extends(SurveyForm, _super);
    function SurveyForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            selectedNodes: [],
            expandedNodes: [_this.props.root.id],
            root: _this.props.root || new dpform_1.RootSection(),
            activeSection: _this.props.root,
            activeSectionPath: [0],
            constants: new dpform_1.Constants(),
        };
        return _this;
    }
    SurveyForm.prototype.componentDidMount = function () {
    };
    SurveyForm.prototype.loadForm = function () {
        var _this = this;
        var requestBody = {
            query: "\n            query GetForm($formId: [String]!){\n                forms(id: $formId){\n                  id\n                  name\n                  content\n                }\n              }",
            variables: {
                formId: "root-53c37497-3808-cfd8-c886-1361dbaab171"
            }
        };
        var token = this.props.token;
        return dpform_1.request(APPCONFIG_1.CONFIG.PROD_SERVER, "forms", requestBody, "Could not delete the game file", token).then(function (file) {
            file = file[0];
            if (file) {
                file.content = JSON.parse(file.content);
                console.log(file.id);
                var root = dpform_1.RootSection.fromJSON(file);
                var valbag = [];
                var iterated = _this.getAllEntries([0, 1], 6, root, null, true, valbag);
                console.log(iterated);
                _this.setState({
                    root: root,
                    activeSection: root,
                    activeSectionPath: [0]
                });
            }
        });
    };
    SurveyForm.prototype.getAllEntries = function (startSectionPath, startIndex, root, fetchType, first, returnbag) {
        if (first === void 0) { first = true; }
        if (!returnbag)
            returnbag = [];
        if (startSectionPath.length <= 0)
            return;
        var section = dpform_1.RootSection.getFromPath(startSectionPath, [root]);
        if (!section)
            return;
        for (var i = startIndex; i < section.content.length; i++) {
            var current = section.content[i];
            if (current instanceof dpform_1.QAQuestion) {
                if (fetchType === dpform_1.QORS.QUESTION || !fetchType)
                    returnbag.push(current);
            }
            else if (current instanceof dpform_1.QuestionSection) {
                if (fetchType === dpform_1.QORS.SECTION || !fetchType)
                    returnbag.push(current);
                this.getAllEntries(startSectionPath.concat(i), 0, root, fetchType, false, returnbag);
            }
        }
        if (first) {
            var cloned = startSectionPath.slice(0);
            var index = cloned.pop();
            if (typeof (index) === "number") {
                this.getAllEntries(cloned, index, root, fetchType, true, returnbag);
            }
        }
        return returnbag;
    };
    SurveyForm.prototype.handleAddSection = function () {
        var _this = this;
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            cloned.addSection(_this.state.activeSectionPath);
            return {
                root: cloned
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.root);
        });
    };
    SurveyForm.prototype.handleAddQuestion = function () {
        var _this = this;
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            cloned.addQuestion(_this.state.activeSectionPath);
            return {
                root: cloned,
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.root);
        });
    };
    SurveyForm.prototype.handleDeleteQuestionOrSection = function (deleteid, path_) {
        var _this = this;
        this.setState(function (prevState) {
            var activeSection = prevState.activeSection;
            var activeSectionPath = prevState.activeSectionPath;
            var parent = path_.slice(0, path_.length - 1);
            var cloned = lodash_1.default.clone(prevState.root);
            var item = dpform_1.RootSection.getFromPath(path_, [_this.state.root]);
            if (item && deleteid !== item.id)
                throw new Error("cannot delete, id mismatch");
            if (item instanceof dpform_1.QAQuestion) {
                cloned.removeQuestion(item.id, path_);
            }
            else if (item instanceof dpform_1.QuestionSection) {
                cloned.removeSection(item.id, path_);
                if (item.id === prevState.activeSection.id) {
                    var parentSection = dpform_1.RootSection.getFromPath(parent, [_this.state.root]);
                    if (parentSection && !(parentSection instanceof dpform_1.QAQuestion)) {
                        activeSection = parentSection;
                        activeSectionPath = parent;
                    }
                }
            }
            return {
                root: cloned,
                activeSection: activeSection,
                activeSectionPath: activeSectionPath
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.root);
        });
    };
    SurveyForm.prototype.handleUpOneLevel = function () {
        if (this.state.activeSectionPath.length > 1) {
            var newSectionPath_1 = this.state.activeSectionPath.slice(0, this.state.activeSectionPath.length - 1);
            var newSection_1 = dpform_1.RootSection.getFromPath(newSectionPath_1, [this.state.root]);
            if (newSection_1 && !(newSection_1 instanceof dpform_1.QAQuestion)) {
                this.setState(function (prevState) {
                    return {
                        activeSection: !newSection_1 ? prevState.activeSection : newSection_1 instanceof dpform_1.QAQuestion ? prevState.activeSection : newSection_1,
                        activeSectionPath: newSectionPath_1
                    };
                });
            }
        }
    };
    SurveyForm.prototype.handleSave = function () {
        if (this.props.onSave)
            this.props.onSave(this.state.root);
    };
    SurveyForm.prototype.handleToolbarItemClick = function (name) {
        switch (name) {
            case "add-section":
                this.handleAddSection();
                break;
            case "add-question":
                this.handleAddQuestion();
                break;
            case "up-one-level":
                this.handleUpOneLevel();
                break;
            case "save-root":
                this.handleSave();
                break;
            case "copy-state":
                var data = JSON.stringify(dpform_1.RootSection.toJSON(this.state.root));
                copy_to_clipboard_1.default(data);
                var toast = {
                    message: "Copied state to clipboard",
                    icon: "tick",
                    intent: core_1.Intent.SUCCESS,
                };
                this.toasterRef.show(toast);
                break;
        }
    };
    SurveyForm.prototype.handleQuestionUpdate = function (question, path) {
        var _this = this;
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            var parent = path.slice(0, path.length - 1);
            var parentSection = dpform_1.RootSection.getFromPath(parent, [cloned]);
            if (!(parentSection instanceof dpform_1.QAQuestion)) {
                var q = _this.state.root.questions[question.id];
                q.updateFromQuestion(question);
            }
            return {
                root: cloned
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.root);
        });
    };
    SurveyForm.prototype.handleFormTreeNodeExpand = function (nodeData, _nodePath, e) {
        nodeData.isExpanded = true;
        var item = dpform_1.RootSection.getFromPath(_nodePath, [this.state.root]);
        if (item) {
            this.setState(function (prevState) {
                var expandedNodes = item ? lodash_1.default.union([item.id], prevState.expandedNodes) : prevState.expandedNodes;
                return {
                    expandedNodes: expandedNodes
                };
            });
        }
    };
    SurveyForm.prototype.handleFormTreeNodeCollapse = function (nodeData) {
        this.setState(function (prevState) {
            var expandedNodes = prevState.expandedNodes.filter((function (item) { return nodeData.id !== item; }));
            return {
                expandedNodes: expandedNodes
            };
        });
    };
    SurveyForm.prototype.handleFormTreeNodeClick = function (nodeData, _nodePath, e) {
        var item = dpform_1.RootSection.getFromPath(_nodePath, [this.state.root]);
        if (item && !(item instanceof dpform_1.QAQuestion)) {
            this.setState(function (prevState) {
                var expandedNodes = item ? lodash_1.default.union([item.id], prevState.expandedNodes) : prevState.expandedNodes;
                var selectedNodes = item ? [item.id] : prevState.selectedNodes;
                return {
                    selectedNodes: selectedNodes,
                    expandedNodes: expandedNodes,
                    activeSection: item && !(item instanceof dpform_1.QAQuestion) ? item : prevState.activeSection,
                    activeSectionPath: _nodePath
                };
            });
        }
        else if (item) {
            this.setState(function (prevState) {
                var parent = _nodePath.length > 1 ? _nodePath.slice(0, _nodePath.length - 1) : _nodePath;
                var parentSection = dpform_1.RootSection.getFromPath(parent, [prevState.root]);
                var selectedQuestion = dpform_1.RootSection.getFromPath(_nodePath, [prevState.root]);
                var expandedNodes = prevState.expandedNodes;
                var selectedNodes = selectedQuestion ? [selectedQuestion.id] : prevState.selectedNodes;
                if (parentSection && !(parentSection instanceof dpform_1.QAQuestion)) {
                    expandedNodes = lodash_1.default.union([parentSection.id], expandedNodes);
                    selectedNodes.push(parentSection.id);
                }
                return {
                    expandedNodes: expandedNodes,
                    selectedNodes: selectedNodes,
                    activeSection: parentSection && !(parentSection instanceof dpform_1.QAQuestion) ? parentSection : prevState.activeSection,
                    activeSectionPath: parent
                };
            });
        }
    };
    SurveyForm.prototype.handleRootNameChange = function (newName) {
        var _this = this;
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            cloned.name = newName;
            return {
                root: cloned
            };
        }, function () {
            if (_this.props.onChange)
                _this.props.onChange(_this.state.root);
        });
    };
    SurveyForm.prototype.handleSectionChange = function (id, path) {
        this.setState(function (prevState) {
            var section = dpform_1.RootSection.getFromPath(path, [prevState.root]);
            var expandedNodes = prevState.expandedNodes;
            var selectedNodes = [];
            if (section && section instanceof dpform_1.QuestionSection) {
                expandedNodes = lodash_1.default.union([section.id], expandedNodes);
                selectedNodes.push(section.id);
            }
            return {
                expandedNodes: expandedNodes,
                selectedNodes: selectedNodes,
                activeSection: section && !(section instanceof dpform_1.QAQuestion) ? section : prevState.activeSection,
                activeSectionPath: path
            };
        });
    };
    SurveyForm.prototype.handleDuplicatingSettingsChange = function (id, dupe) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            cloned.sections[id].setDuplicatingSettings(dupe);
            return {
                root: cloned
            };
        });
    };
    SurveyForm.prototype.handleSectionNameChange = function (id, v) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            var item = cloned.sections[id];
            item.name = v;
            return {
                root: cloned
            };
        });
    };
    SurveyForm.prototype.handleMoveUp = function (id, path) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            var newPath = lodash_1.default.clone(path);
            if (newPath[newPath.length - 1] > 0) {
                newPath[newPath.length - 1] = newPath[newPath.length - 1] - 1;
            }
            cloned.moveItem(path, newPath);
            return {
                root: cloned
            };
        });
    };
    SurveyForm.prototype.handleSectionConditionChange = function (sectionId, literals) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            cloned.sections[sectionId].appearingCondition.setLiterals(literals);
            return {
                root: cloned
            };
        });
    };
    SurveyForm.prototype.handleSectionCustomIdChange = function (sectionId, v) {
        this.setState(function (prevState) {
            var cloned = lodash_1.default.clone(prevState.root);
            cloned.sections[sectionId].customId = v;
            return {
                root: cloned
            };
        });
    };
    SurveyForm.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(reactstrap_1.Row, null,
            react_1.default.createElement(core_1.Toaster, { ref: function (r) { return r ? _this.toasterRef = r : null; } }),
            react_1.default.createElement(constants_1.ConstantDefinitions, { isOpen: false }),
            react_1.default.createElement(Toolbar_1.Toolbar, { handleItemClick: this.handleToolbarItemClick.bind(this) },
                react_1.default.createElement(core_1.EditableText, { value: this.state.root.name, onChange: this.handleRootNameChange.bind(this) })),
            react_1.default.createElement("div", { className: "container" },
                react_1.default.createElement("div", { style: { background: "transparent" }, className: "sidebar" },
                    react_1.default.createElement("div", { className: "sidebar-wrapper" },
                        react_1.default.createElement(formtree_1.FormTree, { expandedNodes: this.state.expandedNodes, selectedNodes: this.state.selectedNodes, handleNodeExpand: this.handleFormTreeNodeExpand.bind(this), handleNodeCollapse: this.handleFormTreeNodeCollapse.bind(this), handleNodeClick: this.handleFormTreeNodeClick.bind(this), root_: this.state.root }))),
                react_1.default.createElement("div", { className: "content" },
                    react_1.default.createElement(section_1.SectionC, { handleSectionCustomIdChange: this.handleSectionCustomIdChange.bind(this), handleSectionConditionChange: this.handleSectionConditionChange.bind(this), handleMoveUp: this.handleMoveUp.bind(this), constants: this.state.constants, handleSectionNameChange: this.handleSectionNameChange.bind(this), definedQuestions: (this.state.root.questions), handleSectionDuplicatingSettingsChange: this.handleDuplicatingSettingsChange.bind(this), handleSectionClick: this.handleSectionChange.bind(this), handleDeleteChildSectionOrQuestion: this.handleDeleteQuestionOrSection.bind(this), parentPath: this.state.activeSectionPath, handleQuestionChange: this.handleQuestionUpdate.bind(this), section: this.state.activeSection })),
                react_1.default.createElement(reactstrap_1.Row, { style: {
                        position: "fixed",
                        height: "60px",
                        bottom: 0,
                        width: "100%",
                        margin: "0 auto"
                    }, className: "fixed-footer" }))));
    };
    return SurveyForm;
}(react_1.default.Component));
exports.SurveyForm = SurveyForm;
