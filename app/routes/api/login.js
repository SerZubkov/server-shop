const Router = require('koa-router');

const {
  checkLogin,
  refreshToken,
  logout,
  checkAuthenticate,
} = require('../../controllers/passport');

const router = new Router({ prefix: '/oauth' });

router
  .post('/login', checkLogin)
  .post('/logout', checkAuthenticate, logout)
  .get('/refresh/:refreshToken', refreshToken);

module.exports = router;
