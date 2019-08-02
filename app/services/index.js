const userServiceHandler = require('./user-service');

module.exports = dependencies => ({
  userService: userServiceHandler(dependencies)
});
