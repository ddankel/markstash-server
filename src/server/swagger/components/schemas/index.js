const glob = require("glob");
const path = require("path");
const _ = require("lodash");

/**
 * Parse a filename and extract the schema name from it
 *
 * Files are in the format './path/to/modelName.schema.js'
 * Expected output: 'ModelName'
 */
const extractNameFromSchemaFile = (file) => {
  const fileName = _.last(file.split("/"));
  const model = fileName.split(".")[0];
  return model[0].toUpperCase() + model.substring(1);
};

const schemas = {};

// Load all model schemas from the models directory into the schemas component.
glob.sync("./src/models/schemas/**/*Schema.js").forEach((file) => {
  const schemaFile = path.resolve(file);
  const schemaName = extractNameFromSchemaFile(file);
  const schema = require(schemaFile);
  schema.properties = _.omit(schema.properties, "id");

  schemas[schemaName] = schema;
});

module.exports = schemas;
