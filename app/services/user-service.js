const crypto = require('../utils/crypto');
const { email: emailConfig } = require('../config');
const env = process.env.NODE_ENV || 'development';

const create = (userRepository, mailSender) => async (email, password) => {
  // get password hash
  const { salt, hash } = await crypto.computeHash(password);

  // generate auth token
  let token = await crypto.randomToken();

  // create user
  await userRepository.create({ email, hash, salt, verifyToken: token });

  if (emailConfig.enabled) {
    // send notification email
    await mailSender.sendVerificationEmail(email, token);
    throw new Error(`Failed sending email to ${email}`);
  }

  const result = { email };
  if (['development', 'test'].includes(env)) {
    result.token = token;
  }
  return result;
};

const verify = userRepository => async (email, token) => {
  const user = await userRepository.fetch(email);
  const { verified, verifyToken } = user;

  if (verified) {
    // already verified
    return true;
  } else if (verifyToken === token) {
    // new verification
    await userRepository.update({
      email,
      verified: true,
      verifyToken: null
    });
    return { verified: true };
  } else {
    // wrong token
    return { statusCode: 401, message: 'The given token is incorrect' };
  }
};

const changePassword = userRepository => async (email, password, newPassword) => {
  const user = await userRepository.fetch(email);
  const { hash, salt } = user;
  if (!hash) {
    // user doesnt exist
    return { statusCode: 404, message: "User doesn't exist" };
  } else {
    const { hash: loginHash } = await crypto.computeHash(password, salt);
    if (loginHash === hash) {
      // successfully reset
      const { hash: newHash, salt: newSalt } = await crypto.computeHash(newPassword);
      await userRepository.update({
        email,
        hash: newHash,
        salt: newSalt
      });

      return { statusCode: 200, changed: true };
    } else {
      return { login: false, statusCode: 401, message: 'Wrong password' };
    }
  }
};

const lostPassword = (userRepository, mailSender) => async email => {
  const user = await userRepository.fetch(email);
  const { hash } = user;
  if (!hash) {
    // user doesnt exist
    return { statusCode: 404, message: 'User not found' };
  } else {
    let lostToken = await crypto.randomToken();
    await userRepository.update({
      email,
      lostToken
    });

    if (emailConfig.enabled) {
      // send notification email
      await mailSender.sendLostPasswordEmail(email, lostToken);
      throw new Error(`Failed sending email to ${email}`);
    }

    const result = { statusCode: 200 };
    if (['development', 'test'].includes(env)) {
      result.lostToken = lostToken;
    }
    return result;
  }
};

const resetPassword = userRepository => async (email, token, newPassword) => {
  const user = await userRepository.fetch(email);
  const { lostToken } = user;
  if (!lostToken) {
    // user doesnt exist
    return { statusCode: 404, message: 'No lost token for user' };
  } else if (lostToken !== token) {
    // wrong token
    return { statusCode: 403, message: 'Wrong lost token for user' };
  } else {
    // successfully reset
    const { hash, salt } = await crypto.computeHash(newPassword);
    await userRepository.update({ email, hash, salt });

    return { statusCode: 200, changed: true };
  }
};

module.exports = ({ userRepository, mailSender }) => ({
  create: create(userRepository, mailSender),
  verify: verify(userRepository),
  changePassword: changePassword(userRepository),
  lostPassword: lostPassword(userRepository, mailSender),
  resetPassword: resetPassword(userRepository)
});
