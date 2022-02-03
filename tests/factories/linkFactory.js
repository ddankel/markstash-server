const { Factory } = require("fishery");
const Link = require("../../src/models/Link");
const groupFactory = require("./groupFactory");

const linkFactory = Factory.define(({ onCreate }) => {
  onCreate(async (link) => {
    if (link.groupPid === undefined) {
      link.groupPid = (await groupFactory.create()).pid;
    }

    return await Link.query().insertGraph(link);
  });

  return {
    title: "Link Title",
    url: "https://www.example.com",
  };
});

module.exports = linkFactory;
