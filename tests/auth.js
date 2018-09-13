/* eslint-disable no-unused-vars */
const test = require('ava');
const agent = require('supertest-koa-agent');

const createApp = require('../app/server');
const clearDB = require('../app/libs/clearDatabase');

const app = agent(createApp());

const testUser = {
  age: 12,
  name: '123123',
  surname: '123123',
  email: 'test123@qweqwe.eee',
  password: 'cnfkrth15069042',
};

let currentUserByToken;

test.before(async (t) => {
  await clearDB();
  t.pass();
});


test('Create user', async (t) => {
  t.plan(2);
  const res = await app.post('/api/users').send(testUser);
  t.is(res.status, 200);
  t.truthy(res.body.email === testUser.email);
});

test('User can success login', async (t) => {
  t.plan(3);

  const res = await app.post('/oauth/login')
    .send({
      email: testUser.email,
      password: testUser.password,
    });
  currentUserByToken = res.body;
  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');
});

test('User get 403 on invalid credentials', async (t) => {
  t.plan(1);

  const res = await app.post('/oauth/login')
    .send({
      email: 'INVALID',
      password: 'INVALID',
    });
  t.is(res.status, 403);
});


test('User can use refresh token only once', async (t) => {
  t.plan(4);
  const res = await app.get(`/oauth/refresh/${currentUserByToken.refreshToken}`);

  t.is(res.status, 200);
  t.truthy(typeof res.body.token === 'string');
  t.truthy(typeof res.body.refreshToken === 'string');
  currentUserByToken = res.body;

  const secondRes = await app.get('/oauth/refresh/INVALID_TOKEN');

  t.is(secondRes.status, 404);
});

test('Refresh tokens become invalid on logout', async (t) => {
  t.plan(2);

  const logoutRes = await app
    .post('/oauth/logout')
    .set('Authorization', `Bearer ${currentUserByToken.token}`);

  t.is(logoutRes.status, 200);

  const refreshRes = await app.get(`/oauth/refresh/${currentUserByToken.refreshToken}`);
  t.is(refreshRes.status, 404);
});

test('Multiple refresh token are valid', async (t) => {
  const user1 = await app.post('/oauth/login')
    .send({
      email: testUser.email,
      password: testUser.password,
    });

  const user2 = await app.post('/oauth/login')
    .send({
      email: testUser.email,
      password: testUser.password,
    });

  t.is(user1.status, 200);
  t.is(user2.status, 200);

  const refreshForUser1 = await app.get(`/oauth/refresh/${user1.body.refreshToken}`);

  t.is(refreshForUser1.status, 200);
  t.truthy(typeof refreshForUser1.body.token === 'string');
  t.truthy(typeof refreshForUser1.body.refreshToken === 'string');

  const refreshForUser2 = await app.get(`/oauth/refresh/${user2.body.refreshToken}`);

  t.is(refreshForUser2.status, 200);
  t.truthy(typeof refreshForUser2.body.token === 'string');
  t.truthy(typeof refreshForUser2.body.refreshToken === 'string');
});
