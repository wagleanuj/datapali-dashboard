"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ofTypeToJSON(t) {
    if (!t) {
        return undefined;
    }
    return {
        name: t.name,
        ofType: ofTypeFromJSON(t.ofType),
    };
}
exports.ofTypeToJSON = ofTypeToJSON;
function answerTypeToJSON(t) {
    return {
        name: t.name,
        ofType: ofTypeToJSON(t.ofType),
    };
}
exports.answerTypeToJSON = answerTypeToJSON;
function ofTypeFromJSON(a) {
    if (!a) {
        return undefined;
    }
    var r = {
        name: a.name,
        ofType: ofTypeFromJSON(a.ofType),
    };
    return r;
}
exports.ofTypeFromJSON = ofTypeFromJSON;
function answerTypeFromJSON(a) {
    var r = {
        name: a.name,
        ofType: ofTypeFromJSON(a.ofType),
    };
    return r;
}
exports.answerTypeFromJSON = answerTypeFromJSON;
