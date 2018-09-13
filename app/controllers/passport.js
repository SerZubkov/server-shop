/* eslint-disable no-underscore-dangle */
/**
 * Module dependencies.
 */

const passport = require('koa-passport');

const tokenController = require('../controllers/token');
const usersController = require('../controllers/users');

/**
 * Login
 */
exports.checkLogin = async (ctx, next) => {
  await passport.authenticate('local', { session: false })(ctx, next);
  const { user } = ctx.state;

  if (user) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    ctx.status = 200;
    ctx.body = await tokenController.addToken(payload);
  } else {
    ctx.throw(403, 'invalid credentials');
  }
};


/**
 * Valid by auth
 */

exports.checkAuthenticate = async (ctx, next) => {
  await passport.authenticate('jwt', { session: false })(ctx, next);
  const { user } = ctx.state;

  if (!user) {
    ctx.throw(401, 'invalid credentials');
  } else {
    ctx.state.user = user;
  }
};

/**
 * RefreshToken by user
 */

exports.refreshToken = async (ctx, next) => {
  const { refreshToken } = ctx.params;
  if (refreshToken) {
    const dbToken = await tokenController.findByToken(refreshToken);
    if (!dbToken.refreshToken) {
      ctx.throw(404, 'Not found token');
      return;
    }
    await tokenController.removeToken(dbToken.id);
    const payload = await usersController.findByIdReturn(dbToken.user);

    ctx.status = 200;
    ctx.body = await tokenController.addToken(payload);
  } else {
    ctx.throw(400, 'Invalid token');
  }
  await next();
};

/**
 * logout user
 */

exports.logout = async (ctx) => {
  const { user: id } = ctx.state;
  await tokenController.removeToken(id);

  ctx.status = 200;
  ctx.body = { success: true };
};
