const { UnauthorizedError } = require("express-oauth2-jwt-bearer");

/**
 * Error handling middleware
 *
 * Send the appropriate http response based on the error object received.
 */
const handleJWTUnauthorizedErrors = (error, req, res, next) => {
  if (error instanceof UnauthorizedError) {
    res.status(401).sendError({
      message: "Unauthorized",
    });
  } else {
    next(error);
  }
};

module.exports = handleJWTUnauthorizedErrors;
