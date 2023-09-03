"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Supported store types
 */
const TYPE = ['memory', 'memcached', 'redis'];
function createStore(store) {
    if (TYPE.indexOf(store.type) === -1)
        throw new Error('Invalid configuration [store.type] ' + store.type);
    return require('./' + store.type).default(store);
}
exports.default = createStore;
