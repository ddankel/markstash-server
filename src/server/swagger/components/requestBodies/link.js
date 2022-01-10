const { buildRequestBodySchema } = require("./utils");
const schema = require("../../../../models/link/link.schema");

const label = "link";
const disallowedProperties = ["id", "groupPid", "ordinal", "createdAt", "updatedAt"];

module.exports = buildRequestBodySchema({ schema, label, disallowedProperties });
