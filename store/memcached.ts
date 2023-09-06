import Memcached from "memcached";
import { log } from "../debug";

export default function createStore(store) {
  const host = store.host || "127.0.0.1";
  const port = store.port || 11211;
  const memcached = new Memcached(host + ":" + port, store.options || {});
  memcached.on("issue", issue);
  memcached.on("failure", failure);
  return {
    set(key, value, lifetime) {
      return new Promise((resolve, rejected) => {
        memcached.set(key, value, lifetime, function (err) {
          if (err) {
            rejected(err);
          } else {
            resolve(null);
          }
        });
      });
    },
    get(key) {
      return new Promise((resolve, rejected) => {
        memcached.get(key, function (err, value) {
          if (err) {
            rejected(err);
          } else {
            resolve(value);
          }
        });
      });
    },
  };
}

function failure(details) {
  log(
    "Memcached: " +
      details.server +
      " went down due to: " +
      details.messages.join(" ")
  );
}
function issue(details) {
  log("Memcached: " + details.server + " issue: " + details.messages.join(" "));
}
