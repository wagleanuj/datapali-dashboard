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
var reactstrap_1 = require("reactstrap");
var react_modal_1 = __importDefault(require("react-modal"));
var CreateCondition_1 = require("./CreateCondition");
var dpform_1 = require("dpform");
var CreateConditionModal = (function (_super) {
    __extends(CreateConditionModal, _super);
    function CreateConditionModal(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (data) {
            _this.setState({
                errors: [],
                literals: data
            });
        };
        _this.primaryButtonHandler = function () {
            var newCondition = new dpform_1.QACondition().setLiterals(_this.state.literals);
            var isValid = dpform_1.QACondition.checkIfValid(newCondition);
            if (!isValid) {
                _this.setState({
                    errors: [{ message: "Condition is not valid!" }]
                });
                return;
            }
            if (_this.props.onSubmit) {
                _this.props.onSubmit(_this.state.literals);
            }
        };
        _this.secondaryButtonHandler = function () {
            if (_this.props.onCancel) {
                _this.props.onCancel(_this.state.literals);
            }
        };
        _this.state = {
            isOpen: _this.props.isOpen,
            literals: _this.props.condition && _this.props.condition.literals ? _this.props.condition.literals : [],
            errors: []
        };
        _this.createCondition_ = react_1.default.createRef();
        return _this;
    }
    CreateConditionModal.prototype.render = function () {
        var _this = this;
        var customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                minHeight: "400px",
                backgroundColor: "#27293d"
            },
            overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.50)"
            }
        };
        return (react_1.default.createElement(react_modal_1.default, { style: customStyles, isOpen: this.props.isOpen },
            react_1.default.createElement(reactstrap_1.ModalBody, null,
                this.props.isOpen && react_1.default.createElement(CreateCondition_1.CreateCondition, { definedQuestions: this.props.definedQuestions, condition: this.props.condition ? this.props.condition : undefined, ref: this.createCondition_, onChange: function (data) { return _this.handleChange(data); } }),
                react_1.default.createElement(reactstrap_1.Row, null,
                    react_1.default.createElement("div", { className: "btn-danger" }, this.state.errors.map(function (item) { return item.message; })))),
            react_1.default.createElement(reactstrap_1.ModalFooter, null,
                react_1.default.createElement(reactstrap_1.Button, { color: "primary", onClick: this.primaryButtonHandler }, "Submit"),
                react_1.default.createElement(reactstrap_1.Button, { color: "secondary", onClick: this.secondaryButtonHandler }, "Cancel"))));
    };
    CreateConditionModal.defaultProps = {
        isOpen: false,
        condition: new dpform_1.QACondition()
    };
    return CreateConditionModal;
}(react_1.default.Component));
exports.CreateConditionModal = CreateConditionModal;
