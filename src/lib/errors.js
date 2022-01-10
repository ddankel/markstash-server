/**
 * Parent custom error class for application errors
 *
 * These classes can be handled in error-handling middleware to respond to
 * requests with the appropriate status codes and messages.
 */
class HttpError extends Error {
  constructor({ message, name, statusCode, data }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, HttpError);
  }
}

/**
 * Custom error class for 400 (Bad Request) errors
 */
class HttpBadRequestError extends HttpError {
  constructor(message = "Bad request", data) {
    super({ message, statusCode: 400, data, name: "HttpBadRequest" });
  }
}

/**
 * Custom error class for 500 (Internal Error) errors
 */
class HttpInternalServerError extends HttpError {
  constructor(message = "Internal server error", data) {
    super({ message, statusCode: 500, data, name: "HttpInternalServerError" });
  }
}

/**
 * Custom error class for 404 (Not Found) errors
 */
class HttpNotFoundError extends HttpError {
  constructor(message = "Not Found", data) {
    super({ message, statusCode: 404, data, name: "HttpNotFound" });
  }
}

/**
 * Custom error class for 401 (Unauthorized) errors
 */
class HttpUnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", data) {
    super({ message, statusCode: 401, data, name: "Unauthorized" });
  }
}

module.exports = {
  HttpError,
  HttpBadRequestError,
  HttpInternalServerError,
  HttpNotFoundError,
  HttpUnauthorizedError,
};
