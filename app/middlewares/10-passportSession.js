/*
  1. req -> ctx.sessions.passport && ctx.sessions.passport.user ?
  2. ctx.sessions.passport.user = 'asdfja8f7634fhlqfjhq347f'
  3. deserialize(ctx.sessions.passport.user) -> ctx.state.user
  4. ctx.isAuthenticated() - true
*/

module.exports = require('koa-passport').session();
