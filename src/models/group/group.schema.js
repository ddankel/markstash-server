const groupschema = {
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
    collectionPid: {
      type: "string",
      description: "PID of the collection this group is associated with",
      example: "3j9xy",
    },
    title: {
      type: "string",
      description: "The name of the group",
      example: "Favorites",
    },
    ordinal: {
      type: "integer",
      description: "Groups are ordered by this value when displayed",
      example: 1,
    },
    createdAt: {
      type: "string",
      description: "Timestamp the record was created",
      example: "2021-12-17T22:10:26.000Z",
    },
    updatedAt: {
      type: "string",
      description: "Timestamp the record was last updated",
      example: "2021-12-17T22:10:26.000Z",
    },
  },
};

module.exports = groupschema;
