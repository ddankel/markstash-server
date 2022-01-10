const { Model, knexSnakeCaseMappers } = require("objection");

// Initialize knex.
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DBNAME,
  },
  ...knexSnakeCaseMappers(),
});

// Give the knex instance to objection.
Model.knex(knex);
