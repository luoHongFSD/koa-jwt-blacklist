const cache = {};

export default function createStore() {
  return {
    async set(key, value, lifetime) {
      try {
        if(lifetime){
          cache[key] = value;
          setTimeout(expire.bind(null, key), lifetime * 1000); 
          return value;
        }
        
        return null
    
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
