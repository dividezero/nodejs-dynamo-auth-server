const dynamoose = require('dynamoose');
const {
  aws: { dynamoDb: ddbConfig }
} = require('../config');

dynamoose.AWS.config.update({
  accessKeyId: ddbConfig.accessKey,
  secretAccessKey: ddbConfig.secretKey,
  region: ddbConfig.region
});

if (ddbConfig.endpoint) {
  dynamoose.local();
}

module.exports = dynamoose;
