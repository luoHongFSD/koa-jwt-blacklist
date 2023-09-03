/**
 * Supported store types
 */
const TYPE = ['memory', 'memcached', 'redis'];


export default async function createStore(store){
  if (TYPE.indexOf(store.type) === -1) throw new Error('Invalid configuration [store.type] ' + store.type);
  return require('./' + store.type)(store);
}

