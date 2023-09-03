"use strict";
/**
 * Redis store
 * https://github.com/NodeRedis/node_redis
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const debug_1 = require("../debug");
function createStore(store) {
    const host = store.host || '127.0.0.1';
    const port = store.port || 6379;
    const options = store.options ? store.options : {
        url: `redis://${host}:${port}`
    };
    const client = redis_1.default.createClient(options);
    client.on('error', error);
    return {
        async set(key, value, lifetime) {
            try {
                await client.connect();
                await client.set(key, value);
                if (lifetime)
                    await client.expire(key, lifetime);
                await client.disconnect();
            }
            catch (error) {
                throw error;
            }
        },
        async get(key) {
            try {
                await client.connect();
                const value = await client.get(key);
                await client.disconnect();
                return value;
            }
            catch (error) {
                throw error;
            }
        }
    };
}
exports.default = createStore;
function error(err) {
    (0, debug_1.log)('Redis: ' + err);
}
//# sourceMappingURL=redis.js.map