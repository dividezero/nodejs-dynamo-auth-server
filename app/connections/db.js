const dynamoose = require('dynamoose');
const {
  aws: { dynamoDb: ddbConfig }
} = require('../config');

if (ddbConfig.endpoint.includes('localhost')) {
  dynamoose.local(ddbConfig.endpoint);
}

dynamoose.AWS.config.update({
  accessKeyId: ddbConfig.accessKey,
  secretAccessKey: ddbConfig.secretKey,
  region: ddbConfig.region
});

module.exports = dynamoose;
