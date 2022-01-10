exports.up = function (knex) {
  return knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();
    table.specificType("pid", "CHAR(6)").index();
    table.string("title");
    table.integer("columns", 1);
    table.integer("ordinal");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("categories");
};
