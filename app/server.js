/* eslint-disable import/no-dynamic-require,global-require */
if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const helmet = require('koa-helmet');
const config = require('config');
const path = require('path');
const fs = require('fs');
const cors = require('@koa/cors');

const routesApi = require('./routes');
// eslint-disable-next-line no-unused-vars
const mongoose = require('./libs/mongoose');

function createApp() {
  const app = new Koa();
  app.keys = [config.secret];

  const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

  middlewares.forEach((middleware) => {
    app.use(require(`./middlewares/${middleware}`));
  });

  app
    .use(helmet())
    .use(cors())
    .use(routesApi())
    .listen();

  return app;
}

if (!module.parent) {
  createApp().listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log('listening at port', `http://${config.host}:${config.port}`);
  });
}

module.exports = createApp;
