const linkSchema = {
  type: "object",
  required: ["title", "url"],
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
    groupPid: {
      type: "string",
      description: "PID of the group this link is associated with",
      example: "3j9xy",
    },
    url: {
      type: "string",
      description: "The link's URL.",
      example: "https://www.example.com",
    },
    title: {
      type: "string",
      description: "The link's label.",
      example: "The Example Website",
    },
    favicon: {
      type: "string",
      description: "URL of the link's favicon, if present",
      example: "https://www.example.com/favicon.png",
    },
    ordinal: {
      type: "integer",
      description: "Links are ordered by this value when displayed",
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

module.exports = linkSchema;
