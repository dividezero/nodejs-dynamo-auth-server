const Joi = require('joi');

const changePassword = async ctx => {
  try {
    await Joi.validate(
      ctx.request.body,
      Joi.object().keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required(),
        newPassword: Joi.string().required()
      })
    );
  } catch (err) {
    ctx.throw(400, err.message);
  }

  const { email, password, newPassword } = ctx.request.body;
  const { statusCode, message, changed } = await ctx.deps.userService.changePassword(
    email,
    password,
    newPassword
  );

  if (statusCode !== 200) {
    ctx.throw(statusCode, message);
  }
  ctx.body = {
    status: 'success',
    changed
  };
};

const lostPassword = async ctx => {
  try {
    await Joi.validate(
      ctx.request.body,
      Joi.object().keys({
        email: Joi.string()
          .email()
          .required()
      })
    );
  } catch (err) {
    ctx.throw(400, err.message);
  }

  const { email } = ctx.request.body;
  const { statusCode, message, lostToken } = await ctx.deps.userService.lostPassword(email);

  if (statusCode !== 200) {
    ctx.throw(statusCode, message);
  }
  ctx.body = {
    status: 'success',
    data: { lostToken }
  };
};

const resetPassword = async ctx => {
  try {
    await Joi.validate(
      ctx.request.body,
      Joi.object().keys({
        email: Joi.string()
          .email()
          .required(),
        lostToken: Joi.string().required(),
        newPassword: Joi.string().required()
      })
    );
  } catch (err) {
    ctx.throw(400, err.message);
  }

  const { email, lostToken, newPassword } = ctx.request.body;
  const { statusCode, message, changed } = await ctx.deps.userService.resetPassword(
    email,
    lostToken,
    newPassword
  );

  if (statusCode !== 200) {
    ctx.throw(statusCode, message);
  }
  ctx.body = {
    status: 'success',
    changed
  };
};

module.exports = {
  changePassword,
  lostPassword,
  resetPassword
};
