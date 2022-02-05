const Link = require("../models/Link");
const Group = require("../models/Group");

const strongParams = (req) => req.parameters.require("link").permit("url", "title").value();

exports.index = async (req, res) => {
  const group = await req.authorize(Group.findByPid(req.params.group_pid));
  const links = await group.$relatedQuery("links").orderBy("ordinal");
  res.sendData(links);
};

exports.create = async (req, res) => {
  const group = await req.authorize(Group.findByPid(req.params.group_pid));
  const link = await group.$relatedQuery("links").insert(strongParams(req));
  res.status(201).sendData(link);
};

exports.show = async (req, res) => {
  const link = await req.authorize(Link.findByPid(req.params.pid));
  res.sendData(link);
};

exports.update = async (req, res) => {
  const link = await req.authorize(Link.findByPid(req.params.pid));
  await link.$query().patch(strongParams(req));
  res.sendData(link);
};

exports.destroy = async (req, res) => {
  const link = await req.authorize(Link.findByPid(req.params.pid));
  await Link.query().deleteById(link.id);
  res.sendData(link);
};
