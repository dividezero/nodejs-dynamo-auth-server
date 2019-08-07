const config = require('../config');

// todo can definitely abstract out the logic elsewhere and only leave the schema definitions here. maybe if there are more tables
const SCHEMA = {
  email: 'S',
  hash: 'S',
  salt: 'S',
  token: 'S',
  verified: 'BOOL',
  verifyToken: 'S',
  lostToken: 'S'
};

const getUpdateObject = (schema, updateModel) => {
  const keys = Object.keys(updateModel);
  return keys.reduce((result, key) => {
    if (updateModel[key]) {
      const dataType = schema[key];
      return {
        ...result,
        [key]: {
          Action: 'PUT',
          Value: {
            [dataType]: updateModel[key]
          }
        }
      };
    }
    return {
      ...result,
      [key]: {
        Action: 'DELETE'
      }
    };
  }, {});
};

// todo joi validations
const store = dbClient => ({ email, hash, salt, token }) => {
  return dbClient
    .putItem({
      TableName: config.DDB_TABLE,
      Item: {
        email: {
          S: email
        },
        hash: {
          S: hash
        },
        salt: {
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

const update = dbClient => (email, user) => {
  const updateObject = getUpdateObject(SCHEMA, user);
  return dbClient
    .updateItem({
      TableName: config.DDB_TABLE,
      Key: {
        email: {
          S: email
        }
      },
      AttributeUpdates: updateObject
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
        hash: { S: hash },
        salt: { S: salt },
        verified: { BOOL: verified }
      }
    } = data;
    const verifyToken = data.Item.verifyToken && data.Item.verifyToken.S;
    const lostToken = data.Item.lostToken && data.Item.lostToken.S;
    return { email, hash, salt, verified, verifyToken, lostToken };
  } else {
    throw new Error(`User email: ${email} not found`);
  }
};

module.exports = dbClient => ({
  store: store(dbClient),
  update: update(dbClient),
  fetch: fetch(dbClient)
});
