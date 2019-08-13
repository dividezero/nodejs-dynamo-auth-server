const logger = require('../logger');
const { name, email: emailConfig } = require('../config');

// todo html templating. s3 or github gist?
const sendVerificationEmail = emailClient => async (email, token) => {
  const subject = 'Verification Email for ' + name;
  const verificationLink =
    emailConfig.verificationPageUrl + '?email=' + encodeURIComponent(email) + '&verify=' + token;

  let info = await emailClient.sendMail({
    from: emailConfig.from,
    to: email,
    subject: subject,
    text: `following link in a browser: ${verificationLink}`,
    html:
      '<html><head>' +
      '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
      '<title>' +
      subject +
      '</title>' +
      '</head><body>' +
      'Please <a href="' +
      verificationLink +
      '">click here to verify your email address</a> or copy & paste the following link in a browser:' +
      '<br><br>' +
      '<a href="' +
      verificationLink +
      '">' +
      verificationLink +
      '</a>' +
      '</body></html>'
  });
  logger.info(`email sent to ${email}`, info);
};

const sendLostPasswordEmail = emailClient => async (email, token) => {
  const subject = 'Password Lost for ' + name;
  const lostLink =
    emailConfig.resetPageUrl + '?email=' + encodeURIComponent(email) + '&lost=' + token;

  let info = await emailClient.sendMail({
    from: emailConfig.from,
    to: email,
    subject: subject,
    text: `following link in a browser: ${lostLink}`,
    html:
      '<html><head>' +
      '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
      '<title>' +
      subject +
      '</title>' +
      '</head><body>' +
      'Please <a href="' +
      lostLink +
      '">click here to reset your password</a> or copy & paste the following link in a browser:' +
      '<br><br>' +
      '<a href="' +
      lostLink +
      '">' +
      lostLink +
      '</a>' +
      '</body></html>'
  });
  logger.info(`email sent to ${email}`, info);
};

module.exports = emailClient => ({
  sendVerificationEmail: sendVerificationEmail(emailClient),
  sendLostPasswordEmail: sendLostPasswordEmail(emailClient)
});
