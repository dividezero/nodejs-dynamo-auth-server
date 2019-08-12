const Model = require('./model');
const config = require('../config');
const { db: dbConfig } = config;

const SCHEMA = {
  email: {
    type: String,
    hashKey: true
  },
  hash: String,
  salt: String,
  token: String,
  verified: Boolean,
  verifyToken: String,
  lostToken: String
};

module.exports = dbClient =>
  Model(dbConfig.userTable, SCHEMA, dbClient);
