const { buildRequestBodySchema } = require("./utils");
const schema = require("../../../../models/collection/collection.schema");

const label = "collection";
const disallowedProperties = ["id", "categoryPid", "ordinal", "createdAt", "updatedAt"];

module.exports = buildRequestBodySchema({ schema, label, disallowedProperties });
