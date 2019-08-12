const dbClient = require('../../app/connections/db');
const loginRepo = require('../../app/repositories/login')(dbClient);
const clientRepo = require('../../app/repositories/client')(dbClient);
const userRepo = require('../../app/repositories/user')(dbClient);

// ids must stay the same across variations
const config = {
  client: {
    dns: 'xxx.testclient.com',
    tokenExpiry: 86400,
    id: '5495c294-c9cb-59dd-99cb-60ace1e572d7',
    secret:
      '6/27rchls1F/Iy17uLQ4aR0v+LMGdDylyxL6FB7RrYSjqyxFBSelD0OOuOFWDTnJxjHD0qHw3QmIXYYEzAsibMDtq0fWha0YUgD/IkUD/SBQiAYrxhDCUlKMYUiWpYyNVkDt8jvteseVuKfoUK9HUF6YLtMAwjeIVsoa1CDrctg=',
    url: 'localhost:8080'
  },
  user: {
    default: {
      verifyToken:
        '1ZM5JGbS5bk/zxFE37cLkajTK2arN7r0PjrJ23B44Eh+aYFAQF/pdLIeWvH272TIdYsYDt6muWTh5PBh0cBRnWctJraUsOtgwTzWCJ6jl85iaFJCX6Dw1gcQk+X3IjNTYoNRZX4UfBN8J55Htksz/5INgLj/p1RBizP9ijGiaks=',
      salt:
        'NQ9zcq7Kt34Du7bt1ek0KSLILzXTzvx2mPYC3OLXxl5Sos8LYQVUTzmuXeJe3HA+0dv1Axu9aO+tK+iGVQ+PBfVy9Pc++tP1GlbJkbQcVUtVG7EqzllTNpCBmgkXk3R4vIwQlBKIDkprmqaDqkAKqlJv0mzVhSrcAb8D/p8xKO8=',
      email: 'testuser@test.com',
      hash:
        'Vjq+QTf+x/DxklnM4OR379VO+Q9avBOQcF9ghc4Ty2H/VpqIxYNp3HzxZShD8DCpCDdGWBsBfo4D//39JufKAizG64mFFyb/FOXAfZYy1OKQ98PoBt5057T32plbmvpuK1ibQA09eOzVsURqauQTpM6JZEKflJyo4H1i/Bw5KtU='
    },
    verified: {
      verified: true,
      salt:
        'NQ9zcq7Kt34Du7bt1ek0KSLILzXTzvx2mPYC3OLXxl5Sos8LYQVUTzmuXeJe3HA+0dv1Axu9aO+tK+iGVQ+PBfVy9Pc++tP1GlbJkbQcVUtVG7EqzllTNpCBmgkXk3R4vIwQlBKIDkprmqaDqkAKqlJv0mzVhSrcAb8D/p8xKO8=',
      email: 'testuser@test.com',
      hash:
        'Vjq+QTf+x/DxklnM4OR379VO+Q9avBOQcF9ghc4Ty2H/VpqIxYNp3HzxZShD8DCpCDdGWBsBfo4D//39JufKAizG64mFFyb/FOXAfZYy1OKQ98PoBt5057T32plbmvpuK1ibQA09eOzVsURqauQTpM6JZEKflJyo4H1i/Bw5KtU='
    }
  },
  login: {
    client: '5495c294-c9cb-59dd-99cb-60ace1e572d7',
    user: 'testuser@test.com',
    identityId: '363b3240-38e8-5625-b0ec-5b4bde91a002',
    token:
      'mX0+j76xroGDtOR7OwiUSB8Gz9Hgh2Hnn5xtDijSG/usBsuaihwqYhBPjA7qpo0brRxeMo+jOPncaHv/WpinqbyYPh7dkVDqheRlMueyT5gETJh0AuUv4ZlzwyHl8idYIRF9+CuRShH256WR0mmO0gF2sUVtcDSyFkS/FEPLKaw='
  }
};

const setupClient = () => clientRepo.create(config.client);
const cleanClient = () => clientRepo.remove(config.client.id);

const setupUser = variant => userRepo.create(config.user[variant || 'default']);
const cleanUser = variant => userRepo.remove(config.user[variant || 'default'].email);

const setupLogin = () => {
  const createDate = new Date();
  const expiryDate = new Date(createDate.getTime());
  expiryDate.setSeconds(expiryDate.getSeconds() + 60);
  return loginRepo.create({ ...config.login, createDate, expiryDate });
};
const cleanLogin = () => loginRepo.remove(config.login.identityId);

module.exports = {
  config,
  setupClient,
  cleanClient,
  setupUser,
  cleanUser,
  setupLogin,
  cleanLogin
};
