const categorieschema = {
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
    title: {
      type: "string",
      description: "The category's name",
      example: "Home",
    },
    ordinal: {
      type: "integer",
      description: "Categories are ordered by this value when displayed",
      example: 1,
    },
    columns: {
      type: "integer",
      description: "The number of columns to display on this category",
      default: 3,
      minimum: 1,
      maximum: 3,
      example: 3,
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

module.exports = categorieschema;
