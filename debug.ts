

let debug = false;

export function log(msg,meta?:string){
  if (!debug) return;

  meta = meta ? JSON.stringify(meta) : '';
  console.log('koa-jwt-blacklist: ' + msg + ' ' + meta);
}





