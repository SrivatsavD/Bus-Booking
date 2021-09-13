const db = require("../../models/index.js");
const Op = db.Sequelize.Op;

exports.create = async (createValues, model) => {
  const Model = db[model];
  const retValue = await Model.create(createValues);
  return retValue;
 };

 exports.findOne = (values, model) => {
 const Model = db[model];
   return Model.findOne(values);
 };

 exports.findAll = ( values, model) => {
   const Model = db[model];
   return Model.findAll(values);
};

exports.findByPk = ( values, model) => {
 const Model = db[model];
 return Model.findByPk(values);
};

exports.findOne = ( values, model) => {
 const Model = db[model];
 return Model.findOne(values);
};

exports.findAndCountAll = ( values, model) => {
 const Model = db[model];
 return Model.findAndCountAll(values);
};

exports.update = ( values, model) => {
 const Model = db[model];
 return Model.update(values);
};

exports.deleteAll = (createValues, model) => {
const Model = db[model];
  return Model.deleteAll(createValues);
};
