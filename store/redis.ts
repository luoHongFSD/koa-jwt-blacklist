/**
 * Redis store
 * https://github.com/NodeRedis/node_redis
 */

import redis from "redis";
import { log } from "../debug";

export default function createStore(store) {
  const host = store.host || "127.0.0.1";
  const port = store.port || 6379;
  const options = store.options
    ? store.options
    : {
        url: `redis://${host}:${port}`,
      };

  const client = redis.createClient(options);
  client.on("error", error);

  return {
    async set(key, value, lifetime) {
      try {
        if (lifetime) {
        await client.connect();
        await client.set(key, value);
        await client.expire(key, lifetime);
        await client.disconnect();
        return value
      }
      return null
      } catch (error) {
        throw error;
      }
    },
    async get(key) {
      try {
        await client.connect();
        const value = await client.get(key);
        await client.disconnect();
        return value;
      } catch (error) {
        throw error;
      }
    },
  };
}

function error(err) {
  log("Redis: " + err);
}
