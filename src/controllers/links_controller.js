const Link = require("../models/link");
const Group = require("../models/group");

const strongParams = (req) => req.parameters.require("link").permit("url", "title").value();

exports.index = async (req, res) => {
  const group = await Group.findByPid(req.params.group_pid);
  const links = await group.$relatedQuery("links");
  res.sendData(links);
};

exports.create = async (req, res) => {
  const group = await Group.findByPid(req.params.group_pid);
  const link = await group.$relatedQuery("links").insert(strongParams(req));
  res.sendData(link);
};

exports.show = async (req, res) => {
  const link = await Link.findByPid(req.params.id);
  res.sendData(link);
};

exports.update = async (req, res) => {
  const link = await Link.findByPid(req.params.id);
  await link.$query().patch(strongParams(req));
  res.sendData(link);
};

exports.destroy = async (req, res) => {
  const link = await Link.findByPid(req.params.id);
  await Link.query().deleteById(link.id);
  res.sendData(link);
};
