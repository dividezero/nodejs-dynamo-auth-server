const AWS = require('aws-sdk');

const cognitoidentity = new AWS.CognitoIdentity();

module.exports = cognitoidentity;
