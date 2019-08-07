// todo finish this
/* eslint-disable */
const config = require('../config');

const getToken = openIdClient => email => {
  const param = {
    IdentityPoolId: config.IDENTITY_POOL_ID,
    Logins: {}
  };
  param.Logins[config.DEVELOPER_PROVIDER_NAME] = email;
  return new Promise((resolve, reject) => {
    // openIdClient.getOpenIdTokenForDeveloperIdentity(param, (err, data) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve({ identityId: data.IdentityId, token: data.Token });
    //   }
    // });
    resolve({ identityId: 'identityId', token: 'token' });
  });
};

module.exports = openIdClient => ({
  getToken: getToken(openIdClient)
});
