exports.up = function (knex) {
  return knex.schema.createTable("collections", (table) => {
    table.increments("id").primary();
    table.specificType("pid", "CHAR(6)").index();
    table
      .specificType("category_pid", "CHAR(6)")
      .references("pid")
      .inTable("categories")
      .onDelete("CASCADE");
    table.string("title");
    table.integer("column", 1);
    table.integer("ordinal");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("collections");
};
