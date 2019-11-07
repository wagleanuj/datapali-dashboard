"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var reactstrap_1 = require("reactstrap");
var react_2 = __importDefault(require("react"));
var core_1 = require("@blueprintjs/core");
exports.QuestionButton = function (props) {
    var _a = react_1.useState(false), isExpanded = _a[0], setIsExpanded = _a[1];
    return (react_2.default.createElement(core_1.ButtonGroup, { className: "bp3-dark", style: { paddingBottom: "20px" }, fill: true, vertical: true },
        react_2.default.createElement(core_1.ButtonGroup, null,
            react_2.default.createElement(core_1.Button, { onClick: function () { return props.handleMoveUp(props.questionId, props.path); }, style: { height: 50, width: 20 }, icon: "arrow-up" }),
            react_2.default.createElement(core_1.Button, { style: { height: 50 }, onClick: function () { return setIsExpanded(!isExpanded); }, alignText: "left", rightIcon: isExpanded ? "chevron-up" : "chevron-down" },
                react_2.default.createElement(reactstrap_1.Badge, { color: "secondary" }, "Q"),
                " ",
                react_2.default.createElement("span", null,
                    props.readablePath,
                    " "),
                " ",
                react_2.default.createElement("span", null,
                    " ",
                    props.questionTitle,
                    " ")),
            react_2.default.createElement(core_1.Button, { onClick: function () { return props.handleDeletion(props.questionId, props.path); }, style: { height: 50, width: 20 }, alignText: "left", rightIcon: "cross" })),
        react_2.default.createElement(core_1.Collapse, { keepChildrenMounted: false, isOpen: isExpanded }, props.children)));
};
