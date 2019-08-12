const crypto = require('../utils/crypto');
const config = require('../config');

const create = clientRepository => async (dns, url, tokenExpiry = config.defaultTokenExpiry) => {
  const id = crypto.generateClientId(dns);
  const secret = await crypto.randomToken();
  return clientRepository.create({ id, dns, secret, url, tokenExpiry });
};

module.exports = ({ clientRepository }) => ({
  create: create(clientRepository)
});
