const AWS = require('aws-sdk');
const {
  aws: { cognito: cognitoConfig }
} = require('../config');

AWS.config.update({
  region: cognitoConfig.region,
  accessKeyId: cognitoConfig.accessKey,
  secretAccessKey: cognitoConfig.secretKey
});

const cognitoidentity = new AWS.CognitoIdentity();

module.exports = cognitoidentity;
