const createUser = async ctx => {
  console.log(`deps ${JSON.stringify(ctx.deps)}`);

  try{
    await ctx.deps.userService.create('hazlan@gmail.com', '123454');
  }catch (e) {
    console.error(e)
  }
  ctx.body = '';
};

module.exports = {
  createUser
};
