import { Redis } from "ioredis";
type Configure = {
    tokenId?: string;
    keyPrefix?: string;
    driver?: 'memory' | 'redis';
    redis?: Redis;
    strict?: boolean;
};
declare const jwtBlackList: {
    configure: (options?: Configure) => void;
    isRevoked: (ctx: any, user: any) => Promise<boolean>;
    revoke: (user: any) => Promise<void>;
};
export default jwtBlackList;
