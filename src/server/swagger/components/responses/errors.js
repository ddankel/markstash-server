const errors = {
  description: `In addition to the status code, the errors of the following types will respond with an error object containing additional information.
  - 400 BadRequest
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 500 Unexpected Error`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "A description of the error",
                example: "Something has gone wrong.",
              },
              type: {
                type: "string",
                description: "the type of error",
                example: "ModelValidation",
              },
              data: {
                description: "Additional error information",
                type: "object",
              },
            },
          },
        },
      },
    },
  },
};

module.exports = errors;
