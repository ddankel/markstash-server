const { cloneDeep, omit } = require("lodash");

exports.buildRequestBodySchema = ({ label, schema, disallowedProperties = [] }) => {
  const requestBody = {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {},
        },
      },
    },
  };

  const permittedSchema = filterDisallowedProperties(schema, disallowedProperties);
  requestBody.content["application/json"].schema.properties[label] = permittedSchema;
  return requestBody;
};

const filterDisallowedProperties = (schema, disallowedProperties) => {
  const thisSchema = cloneDeep(schema);
  thisSchema.properties = omit(thisSchema.properties, disallowedProperties);
  return thisSchema;
};
