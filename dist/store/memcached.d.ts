export default function createStore(store: any): {
    set(key: any, value: any, lifetime: any): Promise<unknown>;
    get(key: any): Promise<unknown>;
};
