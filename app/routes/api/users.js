const Router = require('koa-router');

const { checkAuthenticate } = require('../../controllers/passport');

const router = new Router({ prefix: '/api/users' });
const users = require('../../controllers/users');

router
  .post('/', users.create)
  .use(checkAuthenticate)
  .get('/', users.getAllUsers)
  .post('/email', users.findByEmail)
  .get('/:userById', users.findById, users.getOneUser)
  .patch('/:userById', users.findById, users.update)
  .delete('/:userById', users.findById, users.delete);

module.exports = router;
