"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRandomId(startingText) {
    if (!startingText)
        startingText = "";
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return startingText + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
exports.getRandomId = getRandomId;
