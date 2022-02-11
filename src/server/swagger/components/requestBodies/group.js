const { buildRequestBodySchema } = require("./utils");
const schema = require("../../../../models/schemas/groupSchema");

const label = "group";
const disallowedProperties = ["id", "collectionPid", "ordinal", "createdAt", "updatedAt"];

module.exports = buildRequestBodySchema({ schema, label, disallowedProperties });
