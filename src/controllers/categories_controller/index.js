const Category = require("../../models/category");

const strongParams = (req) => req.parameters.require("category").permit("title", "columns").value();

exports.index = async (req, res) => {
  const categories = await req.currentUser.$relatedQuery("categories").orderBy("ordinal");
  res.sendData(categories);
};

exports.create = async (req, res) => {
  const category = await Category.query().insert(strongParams(req));
  res.status(201).sendData(category);
};

exports.show = async (req, res) => {
  const category = await Category.findByPid(req.params.id);
  res.sendData(category);
};

exports.update = async (req, res) => {
  const category = await Category.findByPid(req.params.id);
  await category.$query().patch(strongParams(req));
  res.sendData(category);
};

exports.destroy = async (req, res) => {
  const category = await Category.findByPid(req.params.id);
  await Category.query().deleteById(category.id);
  res.sendData(category);
};
