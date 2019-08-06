const config = require('../config');

// todo joi validations
const store = dbClient => ({ email, passwordHash, salt, token }) => {
  console.log('storing');
  console.log(email, passwordHash, salt, token);
  return dbClient
    .putItem({
      TableName: config.DDB_TABLE,
      Item: {
        email: {
          S: email
        },
        passwordHash: {
          S: passwordHash
        },
        passwordSalt: {
          S: salt
        },
        verified: {
          BOOL: false
        },
        verifyToken: {
          S: token
        }
      },
      ConditionExpression: 'attribute_not_exists (email)'
    })
    .promise();
};

const fetch = dbClient => async email => {
  const data = await dbClient
    .getItem({
      TableName: config.DDB_TABLE,
      Key: {
        email: {
          S: email
        }
      }
    })
    .promise();

  if ('Item' in data) {
    const {
      Item: {
        passwordHash: { S: hash },
        passwordSalt: { S: salt },
        verified: { BOOL: verified }
      }
    } = data;
    return { email, hash, salt, verified };
  } else {
    throw new Error(`User email: ${email} not found`);
  }
};

module.exports = dbClient => ({
  store: store(dbClient),
  fetch: fetch(dbClient)
});
