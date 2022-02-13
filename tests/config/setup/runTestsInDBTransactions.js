const { Model, transaction } = require("objection");
const knex = require("./knex");

/**
 * Run each test within a knex transaction and rollback after completion
 *
 * Each test is run within a transaction to make sure the database is in a
 * predictable empty state for each test.
 */
const runTestsInDBTransactions = () => {
  global.beforeAll(async () => {
    // Create global connection txn objects
    global.knex = knex;
    global.txn = null;
  });

  global.beforeEach(async () => {
    // Start a transaction
    global.txn = await transaction.start(global.knex);
    Model.knex(global.txn);
  });

  global.afterEach(async () => {
    // Rollback the transaction
    await global.txn.rollback();
    Model.knex(knex);
  });

  global.afterAll(async () => {
    // Terminate the knex connection
    global.knex.destroy();
  });
};

module.exports = runTestsInDBTransactions;
