const { transaction, Model, knexSnakeCaseMappers } = require("objection");
const toMatchIds = require("./setup/toMatchIds");

// Import custom matchers
expect.extend(toMatchIds);

// Initialize knex.
const config = {
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DBNAME,
  },
  pool: { min: 1, max: 1 },
  ...knexSnakeCaseMappers(),
};

const knex = require("knex")(config);
Model.knex(knex);

global.beforeAll(async () => {
  // Reset DB schema via migrations
  // await knex.migrate.rollback({}, true);
  await knex.migrate.latest();
  global.knex = knex;
  global.txn = null;
});

global.beforeEach(async () => {
  // Start a transaction
  global.txn = await transaction.start(knex);
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
