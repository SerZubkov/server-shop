const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
// secret data can be moved to env variables
// or a separate config
  host: 'localhost',
  port: '5984',
  secret: 'mysecret',
  jwtSecret: 'jwtSecret',
  mongoose: {
    uri: 'mongodb://localhost/shop',
    options: {
      useNewUrlParser: true,
      poolSize: 2,
      keepAlive: 1,
      connectTimeoutMS: 30000,
    },
  },
  crypto: {
    hash: {
      length: 128,
      // may be slow(!): iterations = 12000 take ~60ms to generate strong password
      iterations: process.env.NODE_ENV === 'production' ? 12000 : 1,
    },
  },
  template: {
    // template.root uses config.root
    root: defer(cfg => path.join(cfg.root, 'templates')),
  },
  root: process.cwd(),
};
