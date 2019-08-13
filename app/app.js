'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const logging = require('@kasa/koa-logging');
const requestId = require('@kasa/koa-request-id');
const apmMiddleware = require('./middlewares/apm');
const errorHandler = require('./middlewares/error-handler');
const koadepsi = require('koa-depsi');
const logger = require('./logger');
const router = require('./routes');

const repositoriesHandler = require('./repositories');
const servicesHandler = require('./services');
const mailSenderHandler = require('./helpers/mail-sender');

class App extends Koa {
  constructor(dependencies) {
    super(dependencies);

    // Trust proxy
    this.proxy = true;
    // Disable `console.errors` except development env
    // Disable `console.errors` except development env
    this.silent = this.env !== 'development';

    this.servers = [];

    this._configureDependencies(dependencies);
    this._configureMiddlewares();
    this._configureRoutes();
  }

  _configureDependencies(dependencies) {
    const { dbClient, emailClient } = dependencies;
    const repositories = repositoriesHandler(dbClient);
    const mailSender = mailSenderHandler(emailClient);
    const deps = { ...repositories, mailSender };
    const services = servicesHandler(deps);

    this.use(koadepsi({ ...deps, ...services }));
  }

  _configureMiddlewares() {
    this.use(errorHandler());
    this.use(apmMiddleware());
    this.use(
      bodyParser({
        enableTypes: ['json', 'form'],
        formLimit: '10mb',
        jsonLimit: '10mb'
      })
    );
    this.use(requestId());
    this.use(
      logging({
        logger,
        overrideSerializers: false
      })
    );
    this.use(
      cors({
        origin: '*',
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
      })
    );
  }

  _configureRoutes() {
    // Bootstrap application router
    this.use(router.routes());
    this.use(router.allowedMethods());
  }

  listen(...args) {
    const server = super.listen(...args);
    this.servers.push(server);
    return server;
  }

  async terminate() {
    // TODO: Implement graceful shutdown with pending request counter
    for (const server of this.servers) {
      server.close();
    }
  }
}

module.exports = App;
