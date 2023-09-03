"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purge = exports.revoke = exports.isRevoked = exports.configure = exports.TYPE = void 0;
const debug_1 = require("./debug");
const utils = __importStar(require("./utils"));
// Defaults
//var store = require('./store')({ type: 'memory' });
let tokenId = "sub";
let keyPrefix = "jwt-blacklist:";
let strict = false;
let store = require("./store")({ type: "memory" });
/**
 * Session revocation types:
 *
 *  - revoke: revoke all matched iat timestamps
 *  - purge:  revoke all timestamps older than iat
 */
exports.TYPE = {
    revoke: "revoke",
    purge: "purge",
};
function configure(opts = {}) {
    if (opts.store) {
        if (opts.store.type) {
            store = require("./store")(opts.store);
            if (opts.store.keyPrefix) {
                utils.checkString(opts.store.keyPrefix, "keyPrefix");
                keyPrefix = opts.store.keyPrefix;
            }
        }
        else if (typeof opts.store.get === "function" &&
            typeof opts.store.set === "function") {
            store = opts.store;
        }
    }
    if (opts.tokenId) {
        utils.checkString(opts.tokenId, "tokenId");
        tokenId = opts.tokenId;
    }
    if (opts.strict) {
        utils.checkBoolean(opts.strict, "strict");
        strict = opts.strict;
    }
}
exports.configure = configure;
/**
 * Check if JWT token is revoked
 *
 * @param   {Object}   req  Express request object
 * @param   {Object}   user Express JWT user object
 * @param   {Function} fn   Callback function
 */
async function isRevoked(ctx, user, token) {
    try {
        let revoked = strict;
        let id = user[tokenId];
        if (!id)
            throw new Error("JWT missing tokenId " + tokenId);
        let key = keyPrefix + id;
        const res = await store.get(key);
        if (!res)
            return revoked;
        (0, debug_1.log)("middleware [" + key + "]", res);
        if (res[exports.TYPE.revoke] && res[exports.TYPE.revoke].indexOf(user.iat) !== -1)
            revoked = true;
        else if (res[exports.TYPE.purge] >= user.iat)
            revoked = true;
        else
            revoked = false;
        return revoked;
    }
    catch (error) {
        throw error;
    }
}
exports.isRevoked = isRevoked;
/**
 * Revoke a single JWT token
 *
 * @param   {Object}   user JWT user payload
 * @param   {Function} [fn] Optional callback function
 */
exports.revoke = operation.bind(null, exports.TYPE.revoke);
/**
 * Pure all existing JWT tokens
 *
 * @param   {Object}   user JWT user payload
 * @param   {Function} [fn] Optional callback function
 */
exports.purge = operation.bind(null, exports.TYPE.purge);
async function operation(type, user) {
    if (!user)
        throw new Error("User payload missing");
    if (typeof user.iat !== "number")
        throw new Error("Invalid user.iat value");
    let id = user[tokenId];
    if (!id)
        throw new Error("JWT missing tokenId " + tokenId);
    let key = keyPrefix + id;
    const res = await store.get(key);
    let data = res || {};
    (0, debug_1.log)("revoke [" + key + "] " + user.iat, data);
    if (type === exports.TYPE.revoke) {
        if (data[exports.TYPE.revoke]) {
            if (data[exports.TYPE.revoke].indexOf(user.iat) === -1) {
                data[exports.TYPE.revoke].push(user.iat);
            }
        }
        else
            data[exports.TYPE.revoke] = [user.iat];
    }
    if (type === exports.TYPE.purge) {
        data[exports.TYPE.purge] = utils.nowInSeconds() - 1;
    }
    let lifetime = user.exp ? user.exp - user.iat : 0;
    await store.set(key, data, lifetime);
}
//# sourceMappingURL=index.js.map