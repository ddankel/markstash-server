require("dotenv").config();
const { knexSnakeCaseMappers } = require("objection");

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: `${process.env.MYSQL_BASENAME}_dev`,
    },
    pool: { min: 2, max: 5 },
    debug: true,
    ...knexSnakeCaseMappers(),
  },

  test: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: `${process.env.MYSQL_BASENAME}_test`,
    },
    pool: { min: 1, max: 1 },
    debug: true,
    ...knexSnakeCaseMappers(),
  },

  staging: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: `${process.env.MYSQL_BASENAME}_staging`,
    },
    pool: { min: 2, max: 5 },
    debug: true,
    ...knexSnakeCaseMappers(),
  },

  production: {
    client: "mysql",
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: `${process.env.MYSQL_BASENAME}_dev`,
    },
    pool: { min: 2, max: 5 },
    ...knexSnakeCaseMappers(),
  },
};
