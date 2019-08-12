const crypto = require('crypto-promise');
const uuid = require('uuid/v5');
const { crypto: cryptoConfig } = require('../config');

const computeHash = async (password, salt) => {
  // Bytesize
  const len = cryptoConfig.byteSize;
  const digest = cryptoConfig.digest;
  const iterations = 4096;

  if (salt) {
    const result = await crypto.pbkdf2(password, salt, iterations, len, digest);
    return { salt, hash: result.toString('base64') };
  } else {
    let newSalt = await randomToken();
    return computeHash(password, newSalt);
  }
};

const randomToken = async (len = cryptoConfig.byteSize) => {
  const result = await crypto.randomBytes(len);
  return result.toString('base64');
};

const generateClientId = dns => uuid(dns, uuid.DNS);
const generateLoginToken = (clientId, email) => uuid(email, clientId);

module.exports = {
  ...crypto,
  computeHash,
  randomToken,
  generateClientId,
  generateIdentytyId: generateLoginToken
};
