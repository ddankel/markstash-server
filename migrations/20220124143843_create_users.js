exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.specificType("pid", "CHAR(6)").index();
    table.string("auth0_id").index();
    table.string("username");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
