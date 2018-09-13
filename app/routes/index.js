const combineRouters = require('koa-combine-routers');
const userRouter = require('./api/users');
const loginRouter = require('./api/login');
const root = require('./api/index');

const router = combineRouters(
  userRouter,
  loginRouter,
  root,
);

module.exports = router;
