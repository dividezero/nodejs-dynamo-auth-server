const {
  aws: { cognito: cognitoConfig }
} = require('../config');

const getToken = openIdClient => email => {
  const param = {
    IdentityPoolId: cognitoConfig.identityPoolId,
    Logins: {}
  };
  param.Logins[cognitoConfig.devProviderName] = email;
  return new Promise((resolve, reject) => {
    openIdClient.getOpenIdTokenForDeveloperIdentity(param, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({ identityId: data.IdentityId, token: data.Token });
      }
    });
    // resolve({ identityId: 'identityId', token: 'token' });
  });
};

module.exports = openIdClient => ({
  getToken: getToken(openIdClient)
});
