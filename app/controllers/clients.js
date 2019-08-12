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

module.exports = {
  createClient
};
