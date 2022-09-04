const { buildRequestBodySchema } = require("./utils");
const schema = require("../../../../models/schemas/collectionSchema");

const label = "collection";
const disallowedProperties = ["id", "categoryPid", "ordinal", "createdAt", "updatedAt"];

module.exports = buildRequestBodySchema({ schema, label, disallowedProperties });
