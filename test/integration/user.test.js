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

  const request = supertest(server);
  let token = '';

  describe('POST /', () => {
    it('<200> should create a user', async () => {
      const res = await request
        .post(prefix)
        .send({
          email,
          password: 'password'
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      expect(body.status).toBe('success');
      token = body.data.token;
      // todo check db
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
      // todo check db
    });
  });
});
