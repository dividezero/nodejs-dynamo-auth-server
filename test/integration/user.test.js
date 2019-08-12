'use strict';

const supertest = require('supertest');
const app = require('../../app');

const server = app.listen();

afterAll(async () => {
  await app.terminate();
});

const randomNum = () => Math.floor(Math.random() * 1000001);

// todo fix test dependency so tests can be run individually. eg: use beforeAll

const prefix = '/user';
const email = `test${randomNum()}@test.com`;
const password = 'password';
const password2 = 'password2';
const password3 = 'password3';

const request = supertest(server);
let token = '';
let lostToken = '';
let clientDns = 'app.testclient.com';
let clientUrl = 'http://localhost:8080';
let clientId = 'dc9a2311-1776-5f5a-9fda-91359649710b';

describe('Users', () => {
  beforeAll(async () => {
    const res = await request
      .post('/client')
      .send({
        dns: clientDns,
        url: clientUrl
      })
      .set({ 'Content-Type': 'application/json' });
    console.log(res.status);
    console.log(res.body);

    if (res.body && res.status === 'success') {
      const {
        body: {
          data: { id }
        }
      } = res;
      clientId = id;
    }
  });

  describe('Create User', () => {
    it('<200> should create a user', async () => {
      const res = await request
        .post(prefix)
        .send({
          email,
          password
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.status).toBe('success');
      token = body.data.token;
    });

    it('<400> should fail if user exists', async () => {
      const res = await request
        .post(prefix)
        .send({
          email,
          password
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(400);

      const { body } = res;
      expect(body.status).toBe('fail');
    });
  });

  describe('POST /verify', () => {
    it('<401> should fail to verify user', async () => {
      const res = await request
        .post(`${prefix}/verify`)
        .send({
          email,
          token: 'not-your-token'
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(401);

      const { body } = res;
      expect(body.status).toBe('fail');
    });

    it('<200> should verify user', async () => {
      const res = await request
        .post(`${prefix}/verify`)
        .send({
          email,
          token
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.status).toBe('success');
    });
  });

  describe('POST /login', () => {
    it('<401> should fail login for user', async () => {
      const res = await request
        .post(`${prefix}/login`)
        .send({
          email,
          clientId,
          password: `wrong ${password}`
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(401);

      const { body } = res;
      expect(body.status).toBe('fail');
    });

    it('<200> should login user and return an identityID and token pair', async () => {
      const res = await request
        .post(`${prefix}/login`)
        .send({
          email,
          clientId,
          password
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.status).toBe('success');
      expect(body.login).toBe(true);
      expect(body.data.identityId).toBeDefined();
      expect(body.data.token).toBeDefined();
    });
  });

  describe('POST /password/forgot`', () => {
    it('<200> should return/email lostToken', async () => {
      const res = await request
        .post(`${prefix}/password/forgot`)
        .send({
          email
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.status).toBe('success');
      lostToken = body.data.lostToken;
    });
  });

  describe('POST /password/change`', () => {
    it('<200> should change password', async () => {
      const res = await request
        .post(`${prefix}/password/change`)
        .send({
          email,
          password,
          newPassword: password2
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.status).toBe('success');
      expect(body.changed).toBe(true);
    });

    it('<200> should login user and return an identityID and token pair', async () => {
      const res = await request
        .post(`${prefix}/login`)
        .send({
          email,
          clientId,
          password: password2
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.login).toBe(true);
      // todo more specific
      expect(body.data.identityId).toBeDefined();
      expect(body.data.token).toBeDefined();
    });
  });

  describe('POST /password/reset`', () => {
    it('<200> should reset password', async () => {
      const res = await request
        .post(`${prefix}/password/reset`)
        .send({
          email,
          lostToken,
          newPassword: password3
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.status).toBe('success');
      expect(body.changed).toBe(true);
    });

    it('<200> should login user and return an identityID and token pair', async () => {
      const res = await request
        .post(`${prefix}/login`)
        .send({
          email,
          clientId,
          password: password3
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.login).toBe(true);
      expect(body.data.identityId).toBeDefined();
      expect(body.data.token).toBeDefined();
    });
  });
});
