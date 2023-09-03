export default function createStore(): {
    set(key: any, value: any, lifetime: any): Promise<any>;
    get(key: any): Promise<any>;
};
