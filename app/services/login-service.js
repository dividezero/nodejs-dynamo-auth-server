const crypto = require('../utils/crypto');

const create = (userRepository, clientRepository, loginRepository) => async (
  clientId,
  email,
  password
) => {
  const user = await userRepository.fetch(email);
  const client = await clientRepository.fetch(clientId);

  if (!user) {
    // user doesnt exist
    return { login: false, statusCode: 404, message: 'User not found' };
  } else if (!client) {
    // client doesnt exist
    return { login: false, statusCode: 404, message: 'Client not found' };
  }

  const { hash, salt, verified } = user;
  if (!verified) {
    // User not verified
    return { login: false, statusCode: 401, message: 'User not verified' };
  } else {
    const { hash: loginHash } = await crypto.computeHash(password, salt);
    if (loginHash === hash) {
      const identityId = crypto.generateIdentytyId(clientId, email);
      const { tokenExpiry } = client;
      const createDate = new Date();
      const expiryDate = new Date(createDate.getTime());
      expiryDate.setSeconds(expiryDate.getSeconds() + tokenExpiry);

      // if exists, refresh token
      const existingLogin = await loginRepository.fetch(identityId);
      if (existingLogin) {
        existingLogin.createDate = createDate;
        existingLogin.expiryDate = expiryDate;

        return {
          login: true,
          refresh: true,
          data: await loginRepository.update(existingLogin)
        };
      } else {
        // new token
        const token = await crypto.randomToken();

        return {
          login: true,
          data: await loginRepository.create({
            identityId,
            token,
            client: clientId,
            user: email,
            createDate,
            expiryDate
          })
        };
      }
    } else {
      return { login: false, statusCode: 401, message: 'Wrong password' };
    }
  }
};

const retrieve = (userRepository, clientRepository, loginRepository) => async (
  clientId,
  clientSecret,
  identityId,
  token
) => {
  const login = await loginRepository.fetch(identityId);

  if (!login) {
    return { statusCode: 404, message: 'Login not found' };
  }

  const { client: existingClientId, token: existingToken, expiryDate, user: email } = login;
  const client = await clientRepository.fetch(clientId);
  if (!client || existingClientId !== clientId) {
    return { statusCode: 404, message: 'Client not found' };
  }
  const { secret: existingSecret } = client;
  if (!client || existingClientId !== clientId) {
    return { statusCode: 400, message: 'Mismatched client' };
  }
  if (existingSecret !== clientSecret) {
    return { statusCode: 401, message: 'Client secret is incorrect' };
  }
  if (token !== existingToken) {
    return { statusCode: 401, message: 'Token is incorrect' };
  }
  const now = new Date();
  if (expiryDate <= now) {
    return { statusCode: 401, message: 'Token has expired' };
  }
  const user = await userRepository.fetch(email);
  if (!user) {
    return { statusCode: 404, message: 'User not found' };
  }

  // todo add user profile here later
  return { statusCode: 200, data: { user: { email }, expiryDate } };
};

module.exports = ({ userRepository, clientRepository, loginRepository }) => ({
  create: create(userRepository, clientRepository, loginRepository),
  retrieve: retrieve(userRepository, clientRepository, loginRepository)
});
