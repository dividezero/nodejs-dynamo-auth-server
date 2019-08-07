const { name, email: emailConfig } = require('../config');

// todo html templating
const sendVerificationEmail = emailClient => (email, token) => {
  const subject = 'Verification Email for ' + name;
  const verificationLink =
    emailConfig.verificationPageUrl + '?email=' + encodeURIComponent(email) + '&verify=' + token;
  return new Promise((resolve, reject) => {
    emailClient.sendEmail(
      {
        Source: emailConfig.from,
        Destination: {
          ToAddresses: [email]
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Html: {
              Data:
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
            }
          }
        }
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const sendLostPasswordEmail = emailClient => (email, token) => {
  const subject = 'Password Lost for ' + name;
  const lostLink = emailConfig.resetPageUrl + '?email=' + encodeURIComponent(email) + '&lost=' + token;

  return new Promise((resolve, reject) =>
    emailClient.sendEmail(
      {
        Source: emailConfig.from,
        Destination: {
          ToAddresses: [email]
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Html: {
              Data:
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
            }
          }
        }
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    )
  );
};

module.exports = emailClient => ({
  sendVerificationEmail: sendVerificationEmail(emailClient),
  sendLostPasswordEmail: sendLostPasswordEmail(emailClient)
});
