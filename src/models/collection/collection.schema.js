const collectionSchema = {
  type: "object",
  required: ["title"],
  properties: {
    id: {
      type: "integer",
      description: "The instance's unique identifier",
      example: 0,
    },
    pid: {
      type: "string",
      description: "The instance's public unique identifier",
      example: "a4jki9",
    },
    categoryPid: {
      type: "string",
      description: "PID of the category this collection is associated with",
      example: "3j9xy",
    },
    title: {
      type: "string",
      description: "The name of the collection",
      example: "Reading List",
    },
    column: {
      type: "integer",
      description: "Which column on the associated category this collection will be displayed in.",
      default: 1,
      minimum: 1,
      maximum: 3,
    },
    ordinal: {
      type: "integer",
      description: "This collection's ordered place, used for sorting",
      example: 1,
      minimum: 1,
    },
    createdAt: {
      description: "Timestamp the record was created",
      type: "string",
      example: "2021-12-17T22:10:26.000Z",
    },
    updatedAt: {
      description: "Timestamp the record was last updated",
      type: "string",
      example: "2021-12-17T22:10:26.000Z",
    },
  },
};

module.exports = collectionSchema;
