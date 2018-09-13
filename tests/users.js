const test = require('ava');
const agent = require('supertest-koa-agent');

const createApp = require('../app/server');
const clearDB = require('../app/libs/clearDatabase');

const app = agent(createApp());

const testUser = {
  age: 12,
  name: 'Ser',
  surname: 'Ser',
  email: 'Ser@ser.ui',
  password: 'cnfkrth15069042',
};

let currentUser;

test.before(async (t) => {
  await clearDB();
  const createUserResponse = await app.post('/api/users').send(testUser);

  const loginUser = await app.post('/oauth/login')
    .send({
      email: 'Ser@ser.ui',
      password: 'cnfkrth15069042',
    });
  currentUser = Object.assign(createUserResponse.body, loginUser.body);

  t.pass();
});

test.after(async (t) => {
  await clearDB();
  t.pass();
});


test('User list', async (t) => {
  const res = await app.get('/api/users')
    .set('Authorization', `${currentUser.type} ${currentUser.token}`);
  t.is(res.status, 200);
  t.truthy(Array.isArray(res.body));
});

test('Get one user by id', async (t) => {
  const res = await app.get(`/api/users/${currentUser.id}`)
    .set('Authorization', `${currentUser.type} ${currentUser.token}`);
  t.is(res.status, 200);
  t.truthy(currentUser.email === res.body.email);
});

test('Get user by invalid id should be 400', async (t) => {
  const res = await app.get('/api/users/999')
    .set('Authorization', `${currentUser.type} ${currentUser.token}`);
  t.is(res.status, 404);
});
