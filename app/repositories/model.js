const getModel = (dbClient, tableName, schema, opts) => {
  const Schema = dbClient.Schema;
  const schemObject = opts ? new Schema(schema, opts) : new Schema(schema);
  return dbClient.model(tableName, schemObject);
};

const getHashKey = schema => {
  const result = Object.keys(schema).filter(key => schema[key].hashKey);
  if (result && result.length > 0) {
    return result[0];
  }
  throw new Error('No hashkey found');
};

const fetch = Model => id => Model.get(id);

const create = Model => model => Model.create(model);

const update = (Model, hashKey) => async model => {
  if (model.save) {
    return model.save();
  }
  const { [hashKey]: id } = model;
  const existingModel = await Model.get(id);
  Object.assign(existingModel, model);
  return existingModel.save();
};

module.exports = (tableName, schema, dbClient, opts) => {
  const Model = getModel(dbClient, tableName, schema, opts);
  return {
    fetch: fetch(Model),
    update: update(Model, getHashKey(schema)),
    create: create(Model)
  };
};
