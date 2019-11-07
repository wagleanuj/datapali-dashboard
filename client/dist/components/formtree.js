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
var react_1 = __importDefault(require("react"));
var dpform_1 = require("dpform");
var FormTree = (function (_super) {
    __extends(FormTree, _super);
    function FormTree(props) {
        var _this = _super.call(this, props) || this;
        _this.handleNodeClick = function (nodeData, _nodePath, e) {
            if (_this.props.handleNodeClick)
                _this.props.handleNodeClick(nodeData, _nodePath, e);
        };
        _this.handleNodeCollapse = function (nodeData, _nodePath, e) {
            if (_this.props.handleNodeCollapse)
                _this.props.handleNodeCollapse(nodeData, _nodePath, e);
        };
        _this.handleNodeExpand = function (nodeData, _nodePath, e) {
            if (_this.props.handleNodeExpand)
                _this.props.handleNodeExpand(nodeData, _nodePath, e);
        };
        _this.state = {};
        return _this;
    }
    FormTree.prototype.getNodeFromQuestionOrSection = function (item, sectionNumber, selectedNodes, expandedNodes) {
        var _this = this;
        var def = {
            id: item.id,
            icon: undefined,
            label: "",
            isSelected: selectedNodes.includes(item.id),
            isExpanded: expandedNodes.includes(item.id)
        };
        if (item instanceof dpform_1.QAQuestion) {
            def.icon = "document";
            def.label = sectionNumber + " " + (item.questionContent.content || "Question");
        }
        else if (item instanceof dpform_1.QuestionSection) {
            def.icon = "folder-close";
            def.label = sectionNumber + " " + (item.name || "Section");
            def.childNodes = item.content.map(function (it, ind) { return _this.getNodeFromQuestionOrSection(it, sectionNumber + "." + (ind + 1), selectedNodes, expandedNodes); });
        }
        return def;
    };
    FormTree.prototype.generateITNodeTree = function (form, selectedNodes, expandedNodes) {
        var _this = this;
        var root = {
            id: form.id,
            hasCaret: true,
            icon: "folder-close",
            label: "Root",
            isExpanded: expandedNodes.includes(form.id),
            isSelected: selectedNodes.includes(form.id),
            childNodes: form.content.map(function (it, ind) { return _this.getNodeFromQuestionOrSection(it, (ind + 1).toString(), selectedNodes, expandedNodes); })
        };
        return [root];
    };
    FormTree.prototype.render = function () {
        console.log(this.props.root_);
        return react_1.default.createElement(core_1.Tree, { contents: this.generateITNodeTree(this.props.root_, this.props.selectedNodes, this.props.expandedNodes), onNodeClick: this.handleNodeClick, onNodeCollapse: this.handleNodeCollapse, onNodeExpand: this.handleNodeExpand, className: core_1.Classes.ELEVATION_0 });
    };
    return FormTree;
}(react_1.default.Component));
exports.FormTree = FormTree;
