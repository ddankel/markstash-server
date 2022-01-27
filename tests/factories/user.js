const { Factory } = require("fishery");
const User = require("../../src/models/user");

const userFactory = Factory.define(({ sequence, onCreate }) => {
  onCreate(async (user) => {
    return await User.query().insertGraph(user);
  });

  return {
    auth0Id: `factory|${sequence}`,
    username: "MyUsername",
  };
});

module.exports = userFactory;
