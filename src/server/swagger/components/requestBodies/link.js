const { buildRequestBodySchema } = require("./utils");
const schema = require("../../../../models/schemas/linkSchema");

const label = "link";
const disallowedProperties = ["id", "groupPid", "ordinal", "createdAt", "updatedAt"];

module.exports = buildRequestBodySchema({ schema, label, disallowedProperties });
