// todo move addresses to .env
module.exports = {
  DDB_TABLE: 'users',
  CRYPTO_BYTE_SIZE: 128,
  CRYPTO_DIGEST: 'sha512',
  // AWS_ACCOUNT_ID: '123412341234',
  // CLI_PROFILE: 'default',
  REGION: 'eu-west-1',
  // BUCKET: 'bucket',
  // MAX_AGE: '10',
  // IDENTITY_POOL_NAME: 'LambdAuth',
  DEVELOPER_PROVIDER_NAME: 'login.mycompany.myapp',
  EXTERNAL_NAME: 'My Authentication',
  EMAIL_SOURCE: 'email@example.com',
  VERIFICATION_PAGE: 'http://localhost:7070'
  // RESET_PAGE: 'http://bucket.s3.amazonaws.com/reset.html'
};
