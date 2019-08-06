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
  } catch (err) {
    ctx.throw(423, err.message);
  }

  try {
    const { email, password } = ctx.request.body;
    const data = await ctx.deps.userService.create(email, password);

    ctx.body = {
      status: 'success',
      data
    };
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      ctx.throw(423, 'User already exists');
    }
    throw err;
  }
};

// todo regex length for token
const verifyUser = async ctx => {
  try {
    await Joi.validate(
      ctx.request.body,
      Joi.object().keys({
        email: Joi.string()
          .email()
          .required(),
        token: Joi.string().required()
      })
    );
  } catch (err) {
    ctx.throw(423, err.message);
  }

  const { email, token } = ctx.request.body;
  await ctx.deps.userService.verify(email, token);

  ctx.body = {
    status: 'success'
  };
};

module.exports = {
  createUser,
  verifyUser
};
