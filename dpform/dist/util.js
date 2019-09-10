"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function request(API_URL, queryName, requestBody, onErrorMessage, token) {
    var headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers.Authorization = token;
    }
    return fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: headers,
    })
        .then(function (res) {
        if (res.status !== 200) {
            throw new Error(onErrorMessage || 'Failed');
        }
        return res.json();
    })
        .then(function (resData) {
        if (resData.errors) {
            throw resData.errors[0]; // throw the first error only
        }
        else if (resData.data && resData.data[queryName]) {
            return resData.data[queryName];
        }
    })
        .catch(function (err) {
        throw err;
    });
}
exports.request = request;
function getReadablePath(nu) {
    return nu.slice(1).map(function (item) { return item + 1; }).join('.');
}
exports.getReadablePath = getReadablePath;
function getRandomId(startingText) {
    if (!startingText) {
        startingText = '';
    }
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return startingText + (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}
exports.getRandomId = getRandomId;
