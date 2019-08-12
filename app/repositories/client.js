const Model = require('./model');
const { db: dbConfig } = require('../config');

const SCHEMA = {
  id: {
    type: String,
    hashKey: true
  },
  dns: String,
  secret: String,
  tokenExpiry: Number,
  url: String
};

module.exports = dbClient => Model(dbConfig.clientTable, SCHEMA, dbClient);
