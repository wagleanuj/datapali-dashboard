"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_dom_1 = __importDefault(require("react-dom"));
function openModal(com) {
    var el = document.getElementById("dp-modal");
    if (!el) {
        el = document.createElement("div");
        el.setAttribute("id", "dp-modal");
        document.body.appendChild(el);
    }
    react_dom_1.default.render(com, el);
}
exports.openModal = openModal;
function destroyModal() {
    var el = document.getElementById("dp-modal");
    if (el)
        react_dom_1.default.unmountComponentAtNode(el);
}
exports.destroyModal = destroyModal;
