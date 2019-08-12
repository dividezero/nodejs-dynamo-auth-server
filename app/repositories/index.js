const userRepository = require('./user');
const clientRepository = require('./client');
const loginRepository = require('./login');

module.exports = dbModel => ({
  userRepository: userRepository(dbModel),
  clientRepository: clientRepository(dbModel),
  loginRepository: loginRepository(dbModel)
});
