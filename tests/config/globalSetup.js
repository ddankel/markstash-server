const { Model } = require("objection");
const knex = require("./setup/knex");

// Exported method will run once before any test files are run
module.exports = async () => {
  // Create knex connection and reset database (if not done already)
  if (!global.knex) {
    Model.knex(knex);
    await knex.migrate.rollback({}, true);
    await knex.migrate.latest();
    global.knex = knex;
  }
};
