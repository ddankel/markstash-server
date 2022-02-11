exports.up = function (knex) {
  return knex.schema.table("categories", (table) => {
    table
      .specificType("user_pid", "CHAR(6)")
      .references("pid")
      .inTable("users")
      .onDelete("CASCADE")
      .after("pid");
  });
};

exports.down = function (knex) {
  return knex.schema.table("categories", (table) => {
    table.dropForeign("user_pid");
    table.dropColumn("user_pid");
  });
};
