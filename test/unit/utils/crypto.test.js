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

  it('should return specific 172 length base64 hash based on specific salt', async () => {
    expect.assertions(1);
    const salt =
      'lbwdTEJ0WR0x/NPwYvAxyg4S3ccQOD8d2xq7mxvjDseBDu6YCzblMUOR9+WpfK+9IvzcSdRntd576K2hB4jHlASz8veYmYLdh9/iwJBtd4ZBacPmiCm1u6yOcQJuWcdfMvXDy/9BfEmocriY0h0BFYZ9o3G84hCmqop1aH+6Iq8=';
    return crypto.computeHash('pass', salt).then(result => {
      const { hash } = result;
      expect(hash).toBe(
        '8yIMEnQHy195zIWLX81mRAT3z4aClsl5rBIlXYN7FmDMv2kURVxFJnZV0OzjSq6QnAANyULF8S8h+AGd7OE9s5GU3tKZq1w8Uh7TyXnvoNk321CuwAahBtqc8JFozZYXdlyONIbyR+eNadVX3i9twP3oVvb88ZzgzdwkjV4xddE='
      );
    });
  });
});
