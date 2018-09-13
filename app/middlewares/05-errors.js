/* eslint-disable guard-for-in,no-restricted-syntax */

module.exports = async function (ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.set('X-Content-Type-Options', 'nosniff');

    if (e.status) {
      ctx.status = e.status;

      // could use template methods to render error page
      ctx.body = {
        error: e.message,
      };
    } else if (e.name === 'ValidationError') {
      ctx.status = 400;

      const errors = {};

      for (const field in e.errors) {
        errors[field] = e.errors[field].message;
      }

      ctx.body = {
        errors,
      };
    } else if (e.name === 'MongoError') {
      ctx.status = 400;

      ctx.body = {
        errors: e.message,
      };
    } else {
      ctx.body = {
        errors: 'Error 500',
      };
      ctx.status = 500;
      console.error(e.message, e.stack);
    }
  }
};
