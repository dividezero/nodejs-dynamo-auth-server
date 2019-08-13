'use strict';

const supertest = require('supertest');
const app = require('../../app');
const {
  config: { client, login },
  setupClient,
  cleanClient,
  setupUser,
  cleanUser,
  setupLogin,
  cleanLogin
} = require('./db-setup');

const server = app.listen();

afterAll(async () => {
  await app.terminate();
});

const request = supertest(server);

describe('Client', () => {
  describe('Create client', () => {
    afterAll(async () => {
      await cleanClient();
    });

    it('<200> should create a client', async () => {
      const res = await request
        .post('/client')
        .send({
          dns: client.dns,
          url: client.url
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      const { data } = body;
      expect(body.status).toBe('success');
      expect(data.id).toBeDefined();
      expect(data.dns).toBeDefined();
      expect(data.secret).toBeDefined();
      expect(data.url).toBeDefined();
      expect(data.tokenExpiry).toBeDefined();
    });

    it('<400> should fail if client exists', async () => {
      const res = await request
        .post('/client')
        .send({
          dns: 'xxx.testclient.com',
          url: 'http://localhost:8080'
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(400);

      const { body } = res;
      expect(body.status).toBe('fail');
    });
  });

  describe('Get credentials', () => {
    beforeAll(async () => {
      await setupClient();
      await setupUser('verified');
      await setupLogin();
    });

    afterAll(async () => {
      await cleanClient();
      await cleanUser();
      await cleanLogin();
    });

    it('<400> wrong clientId should get validation errors', async () => {
      const res = await request
        .post('/login/retrieve')
        .send({
          clientId: `notyour${client.id}`,
          clientSecret: client.secret,
          identityId: login.identityId,
          token: login.token
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(400);

      const { body } = res;
      expect(body.status).toBe('fail');
    });

    it('<401> wrong client secret should get authorization errors', async () => {
      const res = await request
        .post('/login/retrieve')
        .send({
          clientId: client.id,
          clientSecret: `notyour${client.secret}`,
          identityId: login.identityId,
          token: login.token
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(401);

      const { body } = res;
      expect(body.status).toBe('fail');
    });

    it('<401> wrong token should get authorization errors', async () => {
      const res = await request
        .post('/login/retrieve')
        .send({
          clientId: client.id,
          clientSecret: `notyour${client.secret}`,
          identityId: login.identityId,
          token: login.token
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(401);

      const { body } = res;
      expect(body.status).toBe('fail');
    });

    it('<200> should receive user credentials', async () => {
      const res = await request
        .post('/login/retrieve')
        .send({
          clientId: client.id,
          clientSecret: client.secret,
          identityId: login.identityId,
          token: login.token
        })
        .set({ 'Content-Type': 'application/json' })
        .expect(200);

      const { body } = res;
      const { data } = body;
      expect(body.status).toBe('success');
      expect(data.user).toBeDefined();
      expect(data.user.email).toBeDefined();
    });
  });
});
