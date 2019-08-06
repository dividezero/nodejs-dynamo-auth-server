const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'xxxx',
  secretAccessKey: 'xxxx'
});

const dynamodb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') });

module.exports = dynamodb;
