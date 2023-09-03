/**
 * Session revocation types:
 *
 *  - revoke: revoke all matched iat timestamps
 *  - purge:  revoke all timestamps older than iat
 */
export declare const TYPE: {
    revoke: string;
    purge: string;
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
export declare function configure(opts?: Configure): void;
/**
 * Check if JWT token is revoked
 *
 * @param   {Object}   ctx  Koa ctx object
 * @param   {Object}   user Koa JWT user object
 * @param   {string}   token   Koa JWT token
 */
export declare function isRevoked(ctx: any, user: any, token: any): Promise<boolean>;
/**
 * Revoke a single JWT token
 *
 * @param   {Object}   user JWT user payload

 */
export declare const revoke: any;
/**
 * Pure all existing JWT tokens
 *
 * @param   {Object}   user JWT user payload
 */
export declare const purge: any;
