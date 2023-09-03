"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowInSeconds = exports.checkBoolean = exports.checkString = exports.optionalCallback = void 0;
const debug_1 = require("./debug");
function optionalCallback(err) {
    if (err)
        (0, debug_1.log)('optionalCallback:', err);
}
exports.optionalCallback = optionalCallback;
function checkString(val, key) {
    if (typeof val !== 'string' || val.length < 1)
        throw new Error('Invalid configuration [' + key + '] should be String');
}
exports.checkString = checkString;
function checkBoolean(val, key) {
    if (typeof val !== 'string' || val.length < 1)
        throw new Error('Invalid configuration [' + key + '] should be String');
}
exports.checkBoolean = checkBoolean;
function nowInSeconds() {
    return Math.round(new Date().getTime() / 1000);
}
exports.nowInSeconds = nowInSeconds;
