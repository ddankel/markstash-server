const {
  HttpBadRequestError,
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnauthorizedError,
} = require("../../lib/errors");

/**
 * Build a responder object to attach to 'res' below
 */
createResponder = (req, res, next) => {
  const responder = {
    _forwardError: (error, ErrorClass = Error, data) => {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorToForward = new ErrorClass(errorMessage, data);
      // forwards error to error handler middleware
      next(errorToForward);
    },

    badRequest: (error, data) => {
      return responder._forwardError(error, HttpBadRequestError, data);
    },
    internalServerError: (error, data) => {
      return responder._forwardError(error, HttpInternalServerError, data);
    },
    notFound: (error, data) => {
      return responder._forwardError(error, HttpNotFoundError, data);
    },
    unauthorized: (error, data) => {
      return responder._forwardError(error, HttpUnauthorizedError, data);
    },
  };

  return responder;
};

/**
 * Attach the Responder to the 'res' object
 *
 * This method allows the user of a single interface on the express response
 * object for directing the application to raise errors and pass them to the
 * application's error handling middleware.
 *
 * @example
 *   res.respond.notFound(error, {message: "a custom message"})
 */
const attachErrorResponder = (req, res, next) => {
  res.respond = createResponder(req, res, next);
  next();
};

module.exports = attachErrorResponder;
