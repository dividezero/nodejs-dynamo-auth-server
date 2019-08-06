const crypto = require('../utils/crypto');
const config = require('../config');

const create = (userRepository, mailSender) => async (email, password) => {
  // get password hash
  const { salt, hash } = await crypto.computeHash(password);
  console.log(`password ${password}`);

  // generate auth token
  let token = await crypto.randomBytes(config.CRYPTO_BYTE_SIZE);
  token = token.toString('hex');

  // store user
  const result = await userRepository.store({ email, passwordHash: hash, salt, token });

  console.log('stored');

  if (config.sendEmails) {
    try {
      // send notification email
      mailSender.sendVerificationEmail(email, token);
    } catch (err) {
      throw new Error(`Failed sending email to ${email}`);
    }
  }

  return result;
};

module.exports = ({ userRepository, mailSender }) => ({
  create: create(userRepository, mailSender)
});
