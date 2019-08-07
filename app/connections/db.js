const AWS = require('aws-sdk');
const {
  aws: { dynamoDb: ddbConfig }
} = require('../config');

AWS.config.update({
  region: ddbConfig.region,
  accessKeyId: ddbConfig.accessKey,
  secretAccessKey: ddbConfig.secretKey
});

const dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint(ddbConfig.endpoint) });

module.exports = dynamodb;
