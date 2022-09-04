exports.up = function (knex) {
  return knex.schema.createTable("groups", (table) => {
    table.increments("id").primary();
    table.specificType("pid", "CHAR(6)").index();
    table
      .specificType("collection_pid", "CHAR(6)")
      .references("pid")
      .inTable("collections")
      .onDelete("CASCADE");
    table.string("title");
    table.integer("ordinal");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("groups");
};
