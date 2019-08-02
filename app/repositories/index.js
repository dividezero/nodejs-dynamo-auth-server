const userRepository = require('./user');

module.exports = dbClient => ({
  userRepository: userRepository(dbClient)
});
