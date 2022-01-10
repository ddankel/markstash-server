const { Factory } = require("fishery");
const Collection = require("../../src/models/collection");
const categoryFactory = require("./category");

const collectionFactory = Factory.define(({ onCreate }) => {
  onCreate(async (collection) => {
    if (collection.categoryPid === undefined) {
      collection.categoryPid = (await categoryFactory.create()).pid;
    }

    return await Collection.query().insertGraph(collection);
  });

  return {
    title: "Collection Title",
  };
});

module.exports = collectionFactory;
