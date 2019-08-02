'use strict';

const supertest = require('supertest');
const os = require('os');
const pkg = require('../../package.json');
const app = require('../../app');


const server = app.listen();

afterAll(async () => {
  await app.terminate();
});

describe('Users', () => {
  const request = supertest(server);

  describe('POST /', () => {
    it('<200> should create a user', async () => {
      const res = await request
        .post('/user')
        .expect('Content-Type', /json/)
        .expect(200);

      const info = res.body;
      const expected = ['name', 'version', 'description', 'environments'];
      expect(Object.keys(info)).toEqual(expect.arrayContaining(expected));
      expect(info.name).toBe(pkg.name);
      expect(info.version).toBe(pkg.version);
      expect(info.description).toBe(pkg.description);
      expect(info.environments).toBeInstanceOf(Object);

      const environments = info.environments;
      expect(environments.hostname).toBe(os.hostname());
      expect(environments.nodeVersion).toBe(process.versions['node']);
      expect(environments.platform).toBe(`${process.platform}/${process.arch}`);
    });
  });
});
