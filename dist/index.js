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
exports.revoke = exports.isRevoked = exports.configure = void 0;
const debug_1 = require("./debug");
const utils = __importStar(require("./utils"));
// Defaults
let tokenId = "sub";
let keyPrefix = "jwt-blacklist:";
let strict = false;
let store = require("./store").default({ type: "memory" });
function configure(opts = {}) {
    if (opts.store) {
        if (opts.store.type) {
            store = require("./store").default(opts.store);
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
    (0, debug_1.setLog)(!!opts.debug);
}
exports.configure = configure;
/**
 * Check if JWT token is revoked
 *
 * @param   {Object}   ctx  Koa ctx object
 * @param   {Object}   user Koa JWT user object
 */
async function isRevoked(ctx, user) {
    try {
        let revoked = strict;
        let id = user[tokenId];
        if (!id) {
            throw new Error("JWT missing tokenId " + tokenId);
        }
        let key = keyPrefix + id;
        const exp = await store.get(key);
        if (!exp) {
            return revoked;
        }
        (0, debug_1.log)("middleware [" + key + "]", exp);
        return Number(exp) - Math.floor(Date.now() / 1000) > 0;
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

 */
async function revoke(user) {
    if (!user) {
        throw new Error("User payload missing");
    }
    let id = user[tokenId];
    if (!id) {
        throw new Error("JWT missing tokenId " + tokenId);
    }
    let key = keyPrefix + id;
    let lifetime = user.exp ? user.exp - Math.floor(Date.now() / 1000) : 0;
    if (lifetime > 0) {
        await store.set(key, user.exp, lifetime);
    }
}
exports.revoke = revoke;
