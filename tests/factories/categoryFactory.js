const { Factory } = require("fishery");
const Category = require("../../src/models/Category");
const userFactory = require("./userFactory");

const categoryFactory = Factory.define(({ sequence, onCreate }) => {
  onCreate(async (category) => {
    if (category.userPid === undefined) {
      category.userPid = (await userFactory.create()).pid;
    }

    return await Category.query().insertGraph(category);
  });

  return {
    title: "Category Title",
    ordinal: sequence,
  };
});

module.exports = categoryFactory;
