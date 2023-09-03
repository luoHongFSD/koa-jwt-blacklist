
import { log } from "./debug"

export function optionalCallback(err){
  if (err) log('optionalCallback:', err);
}


export function checkString(val, key){
  if (typeof val !== 'string' || val.length < 1) throw new Error('Invalid configuration [' + key + '] should be String');
}

export function checkBoolean(val, key){
  if (typeof val !== 'string' || val.length < 1) throw new Error('Invalid configuration [' + key + '] should be String');
}

export function nowInSeconds(){
  return Math.round(new Date().getTime() / 1000);
}


