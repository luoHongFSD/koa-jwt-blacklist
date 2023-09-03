"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
let debug = false;
function log(msg, meta) {
    if (!debug)
        return;
    meta = meta ? JSON.stringify(meta) : '';
    console.log('koa-jwt-blacklist: ' + msg + ' ' + meta);
}
exports.log = log;
