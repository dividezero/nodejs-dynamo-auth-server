'use strict';

const debug = require('debug')('koa:error-handler');
const Response = require('../utils/response');
const { INVALID_REQUEST, UNKNOWN_ENDPOINT, UNKNOWN_ERROR } = require('../constants/error');

/**
 * Return middleware that handle exceptions in Koa.
 * Dispose to the first middleware.
 *
 * @return {function} Koa middleware.
 */
module.exports = () => {
  debug('Create a middleware');

  return async function errorHandler(ctx, next) {
    try {
      await next();

      // Respond 404 Not Found for unhandled request
      if (!ctx.body && (!ctx.status || ctx.status === 404)) {
        debug('Unhandled by router');
        return Response.notFound(ctx, UNKNOWN_ENDPOINT);
      }
    } catch (err) {
      console.error('An error occured: %s', err.name);

      if (err.name === 'ValidationError') {
        return Response.fail(ctx, { ...INVALID_REQUEST, message: err.message });
      } else {
        return Response.internalServerError(ctx, UNKNOWN_ERROR);
      }
    }
  };
};
