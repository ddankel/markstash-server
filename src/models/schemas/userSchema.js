const userSchema = {
  type: "object",
  required: ["auth0Id"],
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
    auth0Id: {
      type: "string",
      description: "User's auth0 account identifier",
      example: "auth0|394icj2mlk329",
    },
    username: {
      type: "string",
      description: "User's display name",
      example: "Userperson",
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

module.exports = userSchema;
