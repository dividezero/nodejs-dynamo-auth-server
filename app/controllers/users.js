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
    ctx.throw(400, err.message);
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
      ctx.throw(400, 'User already exists');
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
    ctx.throw(400, err.message);
  }

  const { email, token } = ctx.request.body;
  const { statusCode, message, verified } = await ctx.deps.userService.verify(email, token);

  if (statusCode && statusCode !== 200) {
    ctx.throw(statusCode, message);
  }

  ctx.body = {
    status: 'success',
    verified
  };
};
const loginUser = async ctx => {
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
    ctx.throw(400, err.message);
  }

  const { email, password } = ctx.request.body;
  const result = await ctx.deps.userService.login(email, password);
  const { statusCode, message } = result;
  if (statusCode && statusCode !== 200) {
    ctx.throw(statusCode, message);
  }

  ctx.body = { status: 'success', ...result };
};

module.exports = {
  createUser,
  verifyUser,
  loginUser
};
