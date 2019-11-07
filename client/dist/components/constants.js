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
var ConstantDefinitions = (function (_super) {
    __extends(ConstantDefinitions, _super);
    function ConstantDefinitions(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    ConstantDefinitions.prototype.render = function () {
        return (react_1.default.createElement(core_1.Drawer, { isOpen: this.props.isOpen }));
    };
    return ConstantDefinitions;
}(react_1.default.Component));
exports.ConstantDefinitions = ConstantDefinitions;
