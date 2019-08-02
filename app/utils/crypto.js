const crypto = require('crypto-promise');
const config = require('../config');

const computeHash = async (password, salt) => {
  // Bytesize
  const len = config.CRYPTO_BYTE_SIZE;
  const digest = config.CRYPTO_DIGEST;
  const iterations = 4096;

  if (salt) {
    const result = await crypto.pbkdf2(password, salt, iterations, len, digest);
    return { salt, hash: result.toString('base64') };
  } else {
    let newSalt = await crypto.randomBytes(len);
    newSalt = newSalt.toString('base64');
    return computeHash(password, newSalt);
  }
};

module.exports = {
  ...crypto,
  computeHash
};
