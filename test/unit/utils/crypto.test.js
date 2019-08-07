'use strict';

const crypto = require('../../../app/utils/crypto');

describe('Compute hash', () => {
  it('should return random 172 length base64 hash', async () => {
    expect.assertions(1);
    return crypto.computeHash('pass').then(result => {
      const { hash } = result;
      expect(hash).toHaveLength(172);
    });
  });
});
