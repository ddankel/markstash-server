exports.up = function (knex) {
  return knex.schema.createTable("links", (table) => {
    table.increments("id").primary();
    table.specificType("pid", "CHAR(6)").index();
    table
      .specificType("group_pid", "CHAR(6)")
      .references("pid")
      .inTable("groups")
      .onDelete("CASCADE");
    table.string("url");
    table.string("title");
    table.string("favicon");
    table.integer("ordinal");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("links");
};
