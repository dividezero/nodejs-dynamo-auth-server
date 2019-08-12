const Model = require('./model');
const { db: dbConfig } = require('../config');

const SCHEMA = {
  identityId: {
    type: String,
    hashKey: true
  },
  token: String,
  client: String,
  user: String,
  createDate: Date,
  expiryDate: Date
};

module.exports = dbClient => Model(dbConfig.loginTable, SCHEMA, dbClient);
