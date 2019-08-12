'use strict';

const Router = require('koa-router');
const miscController = require('./controllers/misc');
const userController = require('./controllers/users');
const passwordController = require('./controllers/password');
const clientController = require('./controllers/clients');

const router = new Router();
router.get('/', miscController.getApiInfo);
router.get('/spec', miscController.getSwaggerSpec);
router.get('/status', miscController.healthcheck);
router.post('/user', userController.createUser);
router.post('/user/verify', userController.verifyUser);
router.post('/user/login', userController.loginUser);
router.post('/user/password/forgot', passwordController.lostPassword);
router.post('/user/password/reset', passwordController.resetPassword);
router.post('/user/password/change', passwordController.changePassword);

router.post('/client', clientController.createClient);
router.post('/login/retrieve', clientController.retrieveUserLogin);

module.exports = router;
