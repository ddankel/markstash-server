const { buildRequestBodySchema } = require("./utils");
const schema = require("../../../../models/schemas/categorySchema");

const label = "category";
const disallowedProperties = ["id", "ordinal", "createdAt", "updatedAt"];

module.exports = buildRequestBodySchema({ schema, label, disallowedProperties });
