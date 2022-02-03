const { UnauthorizedError } = require("express-oauth2-jwt-bearer");
const { HttpError } = require("../../lib/errors");

/**
 * Error handling middleware
 *
 * Send the appropriate http response based on the error object received.
 */
const handleHttpErrors = (error, req, res, next) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).sendError({
      message: error.message,
      type: error.name,
      data: error.data,
    });
  } else {
    res.status(500).send();
  }
};

module.exports = handleHttpErrors;
