require("dotenv").config({ path: ".env.test" });
const { knexSnakeCaseMappers } = require("objection");

// Knex config
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

module.exports = knex;
