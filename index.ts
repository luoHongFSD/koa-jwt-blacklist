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

 */

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
 */
export async function isRevoked(ctx, user) {
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
    log("middleware [" + key + "]", exp);
    return Number(exp) - Math.floor(Date.now() / 1000) > 0;
  } catch (error) {
    throw error;
  }
}

/**
 * Revoke a single JWT token
 *
 * @param   {Object}   user JWT user payload

 */
export async function revoke(user) {
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
