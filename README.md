# koa-jwt-blacklist

## Install

```
npm install koa-jwt-blacklist
```

## Example

```
var Koa = require('koa');
var jwt = require('koa-jwt');
var blacklist = require('koa-jwt-blacklist');


var app = new Koa();


//default configure options

type IConfigureOPTS = {
  strict?: boolean; //false
  tokenId?: string;  //sub
  store?: {
    options?:any   //store.options store configure
    type?: string; //memory
    host: string; //127.0.0.1
    port?: string; //redis:6379 memcached:11211
    keyPrefix?: string; //"jwt-blacklist:"
    get?: (key: string) => Promise<any>; //custom store get =>Promise
    set?: (key: string, value: any) => Promise<any>; //custom store set => Promise
  };
};
const options = {}
blacklist.configure(options:IConfigureOPTS)

app.use(jwt({ secret:'shared-secret',isRevoked:blacklist.isRevoked }).unless({
    path: [/^\/public/]
  }))


//Logout
app.use(async function(ctx){
     blacklist.revoke(ctx.state.user)
     ctx.body = "logout"
})


//Login

import jsonwebtoken from 'jsonwebtoken'
app.use(async function(ctx){
      const user = {userId:'userId'}
      const token = jsonwebtoken.sign({
      data: user,
      sub:user.userId,  //tokenId
      // 设置 token 过期时间
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 60 seconds * 60 minutes = 1 hour
    }, 'shared-secret')

    ctx.body = token
})

```
