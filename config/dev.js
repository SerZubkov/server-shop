const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
// secret data can be moved to env variables
// or a separate config
  host: 'localhost',
  port: '5984',
  secret: 'mysecret',
  jwtSecret: 'jwtSecret',
  expiresIn: '40s',
  mongoose: {
    uri: 'mongodb://localhost/shopDev',
    options: {
      useNewUrlParser: true,
      poolSize: 2,
      keepAlive: 1,
      connectTimeoutMS: 30000,
    },
  },
  mailer: {
    transport: 'gmail',
    gmail: {
      user: 'neowork.zub@yandex.ru',
      password: 'cnfkrth15069042',
    },
    senders: {
      fromEmail: 'neowork.zub@yandex.ru',
      fromName: 'Shop Node',
      signature: '<em>С уважением,<br>Я</em>',
      /* newsletters example
      informer: {
        fromEmail: 'informer@gmail.com',
        fromName:  'Newsletters',
        signature: "<em>Have fun!</em>"
      }
      */
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
    root: defer(cfg => path.join(cfg.root, 'app/templates')),
  },
  root: process.cwd(),
};
