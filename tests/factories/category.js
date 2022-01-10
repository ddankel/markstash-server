const { Factory } = require("fishery");
const Category = require("../../src/models/category");

const categoryFactory = Factory.define(({ sequence, onCreate }) => {
  onCreate(async (category) => {
    return await Category.query().insertGraph(category);
  });

  return {
    title: "Category Title",
    ordinal: sequence,
  };
});

module.exports = categoryFactory;
