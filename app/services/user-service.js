const crypto = require('../utils/crypto');
const { email: emailConfig } = require('../config');

const create = (userRepository, mailSender) => async (email, password) => {
  // get password hash
  const { salt, hash } = await crypto.computeHash(password);

  // generate auth token
  let token = await crypto.randomToken();

  // store user
  await userRepository.store({ email, hash, salt, token });

  if (emailConfig.enabled) {
    try {
      // send notification email
      mailSender.sendVerificationEmail(email, token);
    } catch (err) {
      throw new Error(`Failed sending email to ${email}`);
    }
  }

  // todo only return token in dev
  return { email, token };
};

const verify = userRepository => async (email, token) => {
  const user = await userRepository.fetch(email);
  const { verified, verifyToken } = user;

  if (verified) {
    // already verified
    return true;
  } else if (verifyToken === token) {
    // new verification
    await userRepository.update(email, {
      verified: true,
      verifyToken: null
    });
    return { verified: true };
  } else {
    // wrong token
    return { statusCode: 401, message: 'The given token is incorrect' };
  }
};

const login = (userRepository, openId) => async (email, password) => {
  const user = await userRepository.fetch(email);
  const { hash, salt, verified } = user;
  if (!hash) {
    // user doesnt exist
    return { login: false, statusCode: 404, message: 'User not found' };
  } else if (!verified) {
    // User not verified
    return {
      login: false,
      verified
    };
  } else {
    const { hash: loginHash } = await crypto.computeHash(password, salt);
    if (loginHash === hash) {
      const { identityId, token } = await openId.getToken(email);
      return {
        login: true,
        data: {
          identityId: identityId,
          token: token
        }
      };
    } else {
      return { login: false, statusCode: 401, message: 'Wrong password' };
    }
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
      await userRepository.update(email, {
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
    await userRepository.update(email, {
      lostToken
    });

    if (emailConfig.enabled) {
      try {
        // send notification email
        mailSender.sendLostPasswordEmail(email, lostToken);
      } catch (err) {
        throw new Error(`Failed sending email to ${email}`);
      }
    }
    // todo only return token in dev
    return { statusCode: 200, lostToken };
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
    await userRepository.update(email, {
      hash,
      salt
    });

    return { statusCode: 200, changed: true };
  }
};

module.exports = ({ userRepository, mailSender, openId }) => ({
  create: create(userRepository, mailSender),
  verify: verify(userRepository),
  login: login(userRepository, openId),
  changePassword: changePassword(userRepository),
  lostPassword: lostPassword(userRepository, mailSender),
  resetPassword: resetPassword(userRepository)
});
