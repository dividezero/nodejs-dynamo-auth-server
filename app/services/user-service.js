const crypto = require('../utils/crypto');
const config = require('../config');

const create = (userRepository, mailSender) => async (email, password) => {
  // get password hash
  const { salt, hash } = await crypto.computeHash(password);

  // generate auth token
  let token = await crypto.randomBytes(config.CRYPTO_BYTE_SIZE);
  token = token.toString('hex');

  // store user
  await userRepository.store({ email, passwordHash: hash, salt, token });

  if (config.sendEmails) {
    try {
      // send notification email
      mailSender.sendVerificationEmail(email, token);
    } catch (err) {
      throw new Error(`Failed sending email to ${email}`);
    }
  }

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
  } else {
    // wrong token
    const err = new Error('The given token is incorrect');
    err.name = 'UserVerificationError';
    throw err;
  }
};

module.exports = ({ userRepository, mailSender }) => ({
  create: create(userRepository, mailSender),
  verify: verify(userRepository)
});
