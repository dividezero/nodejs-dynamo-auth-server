const AWS = require('aws-sdk');
const config = require('../config');

AWS.config.update({
  region: config.REGION,
  accessKeyId: 'xxxx',
  secretAccessKey: 'xxxx'
});

const dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });

module.exports = dynamodb;
