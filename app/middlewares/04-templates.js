// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly

module.exports = async function (ctx, next) {
  await next();
};
