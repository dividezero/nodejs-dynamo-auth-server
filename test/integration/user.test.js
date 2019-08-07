'use strict';

const supertest = require('supertest');
const app = require('../../app');

const server = app.listen();

afterAll(async () => {
  await app.terminate();
});

const randomNum = () => Math.floor(Math.random() * 101);

describe('Users', () => {
  const prefix = '/user';
  const email = `test${randomNum()}@test.com`;
  const password = 'password';
  const newPassword = 'newPassword';

  const request = supertest(server);
  let token = '';
  let lostToken = '';

  describe('POST /', () => {
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
  });

  describe('POST /verify', () => {
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
    it('<200> should login user and return an identityID and token pair', async () => {
      const res = await request
        .post(`${prefix}/login`)
        .send({
          email,
          password
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
      // todo more specific
      lostToken = body.data.lostToken;
    });
  });

  describe('POST /password/reset`', () => {
    it('<200> should reset password', async () => {
      const res = await request
        .post(`${prefix}/password/reset`)
        .send({
          email,
          lostToken,
          newPassword
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
          password: newPassword
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
});
