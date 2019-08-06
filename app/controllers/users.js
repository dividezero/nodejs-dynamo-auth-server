const Joi = require('joi');

const createUser = async ctx => {
  try {
    await Joi.validate(
      ctx.request.body,
      Joi.object().keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      })
    );
    const { email, password } = ctx.request.body;
    await ctx.deps.userService.create(email, password);

    ctx.body = '';
  } catch (err) {
    ctx.log.error(err);
    throw err;
  }
};

module.exports = {
  createUser
};
