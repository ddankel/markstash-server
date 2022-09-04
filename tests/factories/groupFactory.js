const { Factory } = require("fishery");
const Group = require("../../src/models/Group");
const collectionFactory = require("./collectionFactory");

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
