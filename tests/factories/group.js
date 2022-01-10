const { Factory } = require("fishery");
const Group = require("../../src/models/group");
const collectionFactory = require("./collection");

const groupFactory = Factory.define(({ onCreate }) => {
  onCreate(async (group) => {
    if (group.collectionPid === undefined) {
      group.collectionPid = (await collectionFactory.create()).pid;
    }

    return await Group.query().insertGraph(group);
  });

  return {
    title: "Default Title",
  };
});

module.exports = groupFactory;
