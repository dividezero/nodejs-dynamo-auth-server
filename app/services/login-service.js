const crypto = require('../utils/crypto');

const create = (userRepository, clientRepository, loginRepository) => async (
  clientId,
  email,
  password
) => {
  const user = await userRepository.fetch(email);
  const client = await clientRepository.fetch(clientId);
  const { hash, salt, verified } = user;
  const { id } = client;
  if (!hash) {
    // user doesnt exist
    return { login: false, statusCode: 404, message: 'User not found' };
  } else if (!id) {
    // client doesnt exist
    return { login: false, statusCode: 404, message: 'Client not found' };
  } else if (!verified) {
    // User not verified
    return {
      login: false,
      verified
    };
  } else {
    const { hash: loginHash } = await crypto.computeHash(password, salt);
    if (loginHash === hash) {
      const identityId = crypto.generateIdentytyId(clientId, email);
      const token = await crypto.randomToken();
      const { tokenExpiry } = client;
      const createDate = new Date();
      const expiryDate = new Date(createDate.getTime());
      expiryDate.setSeconds(expiryDate.getSeconds() + tokenExpiry);

      const login = await loginRepository.create({
        identityId,
        token,
        client: clientId,
        user: email,
        createDate,
        expiryDate
      });

      return {
        login: true,
        data: login
      };
    } else {
      return { login: false, statusCode: 401, message: 'Wrong password' };
    }
  }
};
module.exports = ({ userRepository, clientRepository, loginRepository }) => ({
  create: create(userRepository, clientRepository, loginRepository)
});
