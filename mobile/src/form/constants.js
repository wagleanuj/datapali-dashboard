"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var Constants = /** @class */ (function () {
    function Constants() {
        this.consts = {};
        this.count = 0;
    }
    Constants.fromJSON = function (a) {
    };
    Constants.toJSON = function (a) {
    };
    Object.defineProperty(Constants.prototype, "ConstantsArray", {
        get: function () {
            return Object.values(this.consts);
        },
        enumerable: true,
        configurable: true
    });
    Constants.prototype.getConstant = function (constname) {
        return lodash_1.default.cloneDeep(this.consts[constname]);
    };
    Constants.prototype.addConstant = function (constant) {
        if (!constant) {
            constant = { name: '', id: 'constant-' + this.count, type: undefined, value: '' };
        }
        this.consts[constant.id] = constant;
        return this;
    };
    Constants.prototype.removeConstant = function (id) {
        if (this.consts[id]) {
            delete this.consts[id];
        }
        return this;
    };
    return Constants;
}());
exports.Constants = Constants;
