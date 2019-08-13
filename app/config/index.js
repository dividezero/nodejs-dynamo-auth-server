'use strict';

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const configs = {
  base: {
    env,
    name: process.env.APP_NAME || 'auth-server',
    host: process.env.APP_HOST || '0.0.0.0',
    port: process.env.APP_PORT || 7070,
    defaultTokenExpiry: 60 * 60 * 24,
    email: {
      enabled: false,
      from: process.env.EMAIL_SOURCE,
      verificationPageUrl: process.env.VERIFICATION_PAGE_URL,
      resetPageUrl: process.env.RESET_PAGE_URL
    },
    db: {
      userTable: process.env.TABLE_USER || 'users',
      loginTable: process.env.TABLE_LOGIN || 'logins',
      clientTable: process.env.TABLE_CLIENT || 'clients'
    },
    crypto: {
      byteSize: Number(process.env.CRYPTO_BYTE_SIZE) || 128,
      digest: process.env.CRYPTO_DIGEST || 'sha512'
    },
    aws: {
      dynamoDb: {
        region: process.env.DYNAMO_REGION || 'eu-west-1',
        endpoint: process.env.DYNAMO_ENDPOINT,
        accessKey: process.env.DYNAMO_ACCESS_KEY || 'xxxx',
        secretKey: process.env.DYNAMO_SECRET_KEY || 'xxxx'
      }
    }
  },
  production: {
    port: process.env.APP_PORT || 7071
  },
  development: {},
  test: {
    port: 7072
  }
};
const config = Object.assign(configs.base, configs[env]);

module.exports = config;
