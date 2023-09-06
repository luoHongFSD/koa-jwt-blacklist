"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memcached_1 = __importDefault(require("memcached"));
const debug_1 = require("../debug");
function createStore(store) {
    const host = store.host || "127.0.0.1";
    const port = store.port || 11211;
    const memcached = new memcached_1.default(host + ":" + port, store.options || {});
    memcached.on("issue", issue);
    memcached.on("failure", failure);
    return {
        set(key, value, lifetime) {
            return new Promise((resolve, rejected) => {
                memcached.set(key, value, lifetime, function (err) {
                    if (err) {
                        rejected(err);
                    }
                    else {
                        resolve(null);
                    }
                });
            });
        },
        get(key) {
            return new Promise((resolve, rejected) => {
                memcached.get(key, function (err, value) {
                    if (err) {
                        rejected(err);
                    }
                    else {
                        resolve(value);
                    }
                });
            });
        },
    };
}
exports.default = createStore;
function failure(details) {
    (0, debug_1.log)("Memcached: " +
        details.server +
        " went down due to: " +
        details.messages.join(" "));
}
function issue(details) {
    (0, debug_1.log)("Memcached: " + details.server + " issue: " + details.messages.join(" "));
}
