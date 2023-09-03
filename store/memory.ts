const cache = {};

export default function createStore() {
  return {
    async set(key, value, lifetime) {
      try {
        cache[key] = value;
        if (lifetime) {
          setTimeout(expire.bind(null, key), lifetime * 1000);
        }
        return value;
      } catch (error) {
        throw error;
      }
    },
    async get(key) {
      return cache[key];
    },
  };
}

function expire(key) {
  Reflect.deleteProperty(cache, key);
}
