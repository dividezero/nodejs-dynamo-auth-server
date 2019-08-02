'use strict';

const Router = require('koa-router');
const miscController = require('./controllers/misc');
const userController = require('./controllers/users');


const router = new Router();
router.get('/', miscController.getApiInfo);
router.get('/spec', miscController.getSwaggerSpec);
router.get('/status', miscController.healthcheck);
router.post('/user', userController.createUser);

module.exports = router;
