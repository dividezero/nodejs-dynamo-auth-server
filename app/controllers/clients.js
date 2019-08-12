const Joi = require('joi');

const createClient = async ctx => {
  try {
    await Joi.validate(
      ctx.request.body,
      Joi.object().keys({
        dns: Joi.string().required(),
        url: Joi.string(),
        tokenExpiry: Joi.string()
      })
    );
  } catch (err) {
    ctx.throw(400, err.message);
  }

  const { dns, url, tokenExpiry } = ctx.request.body;
  const data = await ctx.deps.clientService.create(dns, url, tokenExpiry);

  ctx.body = {
    status: 'success',
    data
  };
};

const retrieveUserLogin = async ctx => {
  try {
    await Joi.validate(
      ctx.request.body,
      Joi.object().keys({
        clientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
        identityId: Joi.string().required(),
        token: Joi.string().required()
      })
    );
  } catch (err) {
    ctx.throw(400, err.message);
  }

  const { clientId, clientSecret, identityId, token } = ctx.request.body;
  const { statusCode, message, data } = await ctx.deps.loginService.retrieve(
    clientId,
    clientSecret,
    identityId,
    token
  );

  if (statusCode && statusCode !== 200) {
    ctx.throw(statusCode, message);
  }

  ctx.body = {
    status: 'success',
    data
  };
};

module.exports = {
  createClient,
  retrieveUserLogin
};
