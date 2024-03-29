const Collection = require("../models/Collection");
const Category = require("../models/Category");
const { relocateCollection } = require("../lib/relocation");

const strongParams = (req) =>
  req.parameters.require("collection").permit("title", "column").value();

exports.index = async (req, res) => {
  const category = await req.authorize(Category.findByPid(req.params.category_pid));
  const collections = await category
    .$relatedQuery("collections")
    .orderBy("column")
    .orderBy("ordinal");
  res.sendData(collections);
};

exports.create = async (req, res) => {
  const category = await req.authorize(Category.findByPid(req.params.category_pid));
  const collection = await category.$relatedQuery("collections").insert(strongParams(req));
  res.status(201).sendData(collection);
};

exports.show = async (req, res) => {
  const collection = await req.authorize(Collection.findByPid(req.params.pid));
  res.sendData(collection);
};

exports.update = async (req, res) => {
  const collection = await req.authorize(Collection.findByPid(req.params.pid));
  await collection.$query().patch(strongParams(req));
  res.sendData(collection);
};

exports.destroy = async (req, res) => {
  const collection = await req.authorize(Collection.findByPid(req.params.pid));
  await Collection.query().deleteById(collection.id);
  res.sendData(collection);
};

exports.relocate = async (req, res) => {
  const params = req.parameters
    .require("collection")
    .permit("categoryPid", "column", "ordinal")
    .value();

  if (params.ordinal < 1) {
    res.respond.badRequest(undefined, { message: "Ordinal must be an integer greater than 0" });
  }

  const collection = await Collection.findByPid(req.params.pid);
  const category = await Category.findByPid(params.categoryPid);
  const collections = await relocateCollection({
    collection,
    category,
    column: params.column,
    ordinal: params.ordinal,
  });

  res.sendData(collections);
};
