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
var toolbarItems = [
    {
        type: "button",
        name: "up-one-level",
        icon: "arrow-up",
        text: ""
    },
    {
        type: "button",
        name: "save-root",
        icon: "floppy-disk",
        text: "Save Form"
    },
    {
        type: "button",
        name: "add-section",
        icon: "box",
        text: "Add Section"
    },
    {
        type: "button",
        name: "add-question",
        icon: "document",
        text: "Add Question"
    },
    {
        type: "button",
        name: "copy-state",
        icon: "clipboard",
        text: "Copy State"
    },
];
var Toolbar = (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Toolbar.prototype.handleClick = function (name) {
        if (this.props.handleItemClick)
            this.props.handleItemClick(name);
    };
    Toolbar.prototype.render = function () {
        var _this = this;
        return (react_1.default.createElement(core_1.Navbar, { className: "bp3-dark", fixedToTop: true },
            react_1.default.createElement(core_1.Navbar.Group, { align: core_1.Alignment.LEFT },
                this.props.children,
                toolbarItems.map(function (item) { return react_1.default.createElement(core_1.Button, { onClick: _this.handleClick.bind(_this, item.name), key: item.name, icon: item.icon, text: item.text, className: "bp3-minimal" }); }))));
    };
    return Toolbar;
}(react_1.default.Component));
exports.Toolbar = Toolbar;
