# koa-jwt-blacklist

## Install

```
npm install koa-jwt-blacklist
```

## Example

```
var Koa = require('koa');
var jwt = require('koa-jwt');

import { configure,revoke,isRevoked } from 'koa-jwt-blacklist';



var app = new Koa();


//default configure options


app.use(jwt({ secret:'shared-secret',isRevoked:isRevoked }).unless({
    path: [/^\/public/]
  }))


//Logout
app.use(async function(ctx){
     await revoke(ctx.state.user)
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
