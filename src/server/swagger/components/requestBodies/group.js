const { buildRequestBodySchema } = require("./utils");
const schema = require("../../../../models/group/group.schema");

const label = "group";
const disallowedProperties = ["id", "collectionPid", "ordinal", "createdAt", "updatedAt"];

module.exports = buildRequestBodySchema({ schema, label, disallowedProperties });
