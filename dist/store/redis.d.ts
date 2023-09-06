/**
 * Redis store
 * https://github.com/NodeRedis/node_redis
 */
export default function createStore(store: any): {
    set(key: any, value: any, lifetime: any): Promise<any>;
    get(key: any): Promise<string>;
};
