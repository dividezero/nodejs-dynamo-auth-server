const userServiceHandler = require('./user-service');
const clientServiceHandler = require('./client-service');
const loginServiceHandler = require('./login-service');

module.exports = dependencies => ({
  userService: userServiceHandler(dependencies),
  clientService: clientServiceHandler(dependencies),
  loginService: loginServiceHandler(dependencies)
});
