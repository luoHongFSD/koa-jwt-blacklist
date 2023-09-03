"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.setLog = void 0;
let debug = false;
function setLog(bool) {
    debug = bool;
}
exports.setLog = setLog;
function log(msg, meta) {
    if (!debug)
        return;
    meta = meta ? JSON.stringify(meta) : '';
    console.log('koa-jwt-blacklist: ' + msg + ' ' + meta);
}
exports.log = log;
