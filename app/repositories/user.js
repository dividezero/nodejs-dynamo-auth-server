const { db: dbConfig } = require('../config');

const SCHEMA = {
  email: String,
  hash: String,
  salt: String,
  token: String,
  verified: Boolean,
  verifyToken: String,
  lostToken: String
};

const getModel = dbClient => dbClient.model(dbConfig.userTable, SCHEMA);

const fetch = User => email => User.get(email);

const create = User => user => User.create(user);

const update = User => async user => {
  if (user.save) {
    return user.save();
  }
  const { email } = user;
  const existingUser = await User.get(email);
  Object.assign(existingUser, user);
  return existingUser.save();
};

module.exports = dbClient => {
  const User = getModel(dbClient);
  return {
    fetch: fetch(User),
    update: update(User),
    create: create(User)
  };
};
