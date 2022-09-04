const Group = require("../models/Group");
const Collection = require("../models/Collection");
const { relocateGroup } = require("../lib/relocation");

const strongParams = (req) => req.parameters.require("group").permit("title").value();

exports.index = async (req, res) => {
  const collection = await req.authorize(Collection.findByPid(req.params.collection_pid));
  const groups = await collection.$relatedQuery("groups");
  res.sendData(groups);
};

exports.create = async (req, res) => {
  const collection = await req.authorize(Collection.findByPid(req.params.collection_pid));
  const group = await collection.$relatedQuery("groups").insert(strongParams(req));
  res.status(201).sendData(group);
};

exports.show = async (req, res) => {
  const group = await req.authorize(Group.findByPid(req.params.pid));
  res.sendData(group);
};

exports.update = async (req, res) => {
  const group = await req.authorize(Group.findByPid(req.params.pid));
  await group.$query().patch(strongParams(req));
  res.sendData(group);
};

exports.destroy = async (req, res) => {
  const group = await req.authorize(Group.findByPid(req.params.pid));
  await Group.query().deleteById(group.id);
  res.sendData(group);
};

exports.relocate = async (req, res) => {
  const params = req.parameters.require("group").permit("collectionPid", "ordinal").value();

  if (params.ordinal < 1) {
    res.respond.badRequest(undefined, { message: "Ordinal must be an integer greater than 0" });
  }

  const group = await Group.findByPid(req.params.pid);
  const collection = await Collection.findByPid(params.collectionPid);
  const groups = await relocateGroup({ group, collection, ordinal: params.ordinal });

  res.sendData(groups);
};
