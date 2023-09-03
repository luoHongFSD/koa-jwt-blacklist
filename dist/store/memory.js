"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = {};
function createStore() {
    return {
        async set(key, value, lifetime) {
            try {
                cache[key] = value;
                if (lifetime)
                    setTimeout(expire.bind(null, key), lifetime * 1000);
                return value;
            }
            catch (error) {
                throw error;
            }
        },
        async get(key) {
            if (cache[key]) {
                return cache[key];
            }
            else {
                throw new Error('key is unf');
            }
        },
    };
}
exports.default = createStore;
;
function expire(key) {
    Reflect.deleteProperty(cache, key);
}
