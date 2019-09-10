"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var condition_1 = require("./condition");
function dupeSettingsToJSON(a) {
    return ({
        isEnabled: a.isEnabled,
        condition: condition_1.QACondition.toJSON(a.condition),
        duplicateTimes: { value: a.duplicateTimes.value, type: a.duplicateTimes.type },
    });
}
exports.dupeSettingsToJSON = dupeSettingsToJSON;
function dupeSettingsFromJSON(a) {
    var r = {
        isEnabled: a.isEnabled,
        duplicateTimes: {
            value: a.duplicateTimes,
            type: a.duplicateTimes.type,
        },
        condition: condition_1.QACondition.fromJSON(a.condition),
    };
    return r;
}
exports.dupeSettingsFromJSON = dupeSettingsFromJSON;
