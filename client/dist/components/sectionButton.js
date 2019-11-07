"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var core_1 = require("@blueprintjs/core");
exports.SectionButton = function (props) {
    var _a = react_1.useState(false), isExpanded = _a[0], setIsExpanded = _a[1];
    return (react_1.default.createElement(core_1.ButtonGroup, { className: "bp3-dark", style: { paddingBottom: "20px" }, fill: true, vertical: true },
        react_1.default.createElement(core_1.ButtonGroup, null,
            react_1.default.createElement(core_1.Button, { style: { width: 20 }, icon: "arrow-up", onClick: function () { return props.handleMoveUp(props.sectionId, props.path); } }),
            react_1.default.createElement(core_1.Navbar, null,
                react_1.default.createElement(core_1.Navbar.Group, { align: core_1.Alignment.LEFT },
                    react_1.default.createElement(core_1.H5, null,
                        react_1.default.createElement("span", null,
                            props.readablePath,
                            " "),
                        react_1.default.createElement(core_1.EditableText, { onChange: props.handleSectionNameChange, placeholder: "Section", defaultValue: props.sectionName }, " "))),
                react_1.default.createElement(core_1.Navbar.Group, { align: core_1.Alignment.RIGHT },
                    react_1.default.createElement(core_1.EditableText, { onChange: props.handleCustomIdChange, placeholder: "Custom Id", defaultValue: props.customId }, " "),
                    react_1.default.createElement(core_1.Button, { icon: "key", onClick: function () { return props.handleOpenConditionSettings(); } }),
                    react_1.default.createElement(core_1.Button, { onClick: function () { return setIsExpanded(!isExpanded); }, icon: "cog" }),
                    react_1.default.createElement(core_1.Button, { icon: "folder-open", onClick: function () { return props.onClick(props.sectionId, props.path); } }))),
            react_1.default.createElement(core_1.Button, { style: { width: 20 }, icon: "cross", onClick: function () { return props.handleDeletion(props.sectionId, props.path); } })),
        react_1.default.createElement(core_1.Collapse, { isOpen: isExpanded, keepChildrenMounted: false }, props.children)));
};
