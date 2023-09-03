import { log, setLog } from "./debug";
import * as utils from "./utils";

// Defaults

let tokenId = "sub";
let keyPrefix = "jwt-blacklist:";
let strict = false;
let store = require("./store").default({ type: "memory" });
/**
 * Session revocation types:
 *
 *  - revoke: revoke all matched iat timestamps
 *  - purge:  revoke all timestamps older than iat
 */

export const TYPE = {
  revoke: "revoke",
  purge: "purge",
};

export type Configure = {
  debug?: boolean;
  strict?: boolean;
  tokenId?: string;
  store?: {
    options?: any;
    type?: string;
    host: string;
    port?: string;
    keyPrefix?: string;
    get?: (key: string) => Promise<any>;
    set?: (key: string, value: any) => Promise<void>;
  };
};

export function configure(opts: Configure = {}) {
  if (opts.store) {
    if (opts.store.type) {
      store = require("./store").default(opts.store);
      if (opts.store.keyPrefix) {
        utils.checkString(opts.store.keyPrefix, "keyPrefix");
        keyPrefix = opts.store.keyPrefix;
      }
    } else if (
      typeof opts.store.get === "function" &&
      typeof opts.store.set === "function"
    ) {
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
  setLog(!!opts.debug);
}

/**
 * Check if JWT token is revoked
 *
 * @param   {Object}   ctx  Koa ctx object
 * @param   {Object}   user Koa JWT user object
 * @param   {string}   token   Koa JWT token
 */
export async function isRevoked(ctx, user, token) {
  try {
    let revoked = strict;
    let id = user[tokenId];
    if (!id) {
      throw new Error("JWT missing tokenId " + tokenId);
    }
    let key = keyPrefix + id;
    const res = await store.get(key);
    if (!res) {
      return revoked;
    }
    log("middleware [" + key + "]", res);
    if (res[TYPE.revoke] && res[TYPE.revoke].indexOf(user.iat) !== -1) {
      revoked = true;
    } else if (res[TYPE.purge] >= user.iat) {
      revoked = true;
    } else {
      revoked = false;
    }
    return revoked;
  } catch (error) {
    throw error;
  }
}

/**
 * Revoke a single JWT token
 *
 * @param   {Object}   user JWT user payload

 */
export const revoke = operation.bind(null, TYPE.revoke);

/**
 * Pure all existing JWT tokens
 *
 * @param   {Object}   user JWT user payload
 */
export const purge = operation.bind(null, TYPE.purge);

async function operation(type, user) {
  if (!user){
    throw new Error("User payload missing");
  } 
  if (typeof user.iat !== "number"){
    throw new Error("Invalid user.iat value");
  } 
  let id = user[tokenId];
  if (!id){
    throw new Error("JWT missing tokenId " + tokenId);
  } 
  let key = keyPrefix + id;
  const res = await store.get(key);
  let data = res || {};
  log("revoke [" + key + "] " + user.iat, data);
  if (type === TYPE.revoke) {
    if (data[TYPE.revoke]) {
      if (data[TYPE.revoke].indexOf(user.iat) === -1) {
        data[TYPE.revoke].push(user.iat);
      }
    } else {
      data[TYPE.revoke] = [user.iat];
    } 
  }

  if (type === TYPE.purge) {
    data[TYPE.purge] = utils.nowInSeconds() - 1;
  }
  let lifetime = user.exp ? user.exp - user.iat : 0;
  await store.set(key, data, lifetime);
}
