const { ValidationError } = require("objection");

class ModelValidationError extends ValidationError {
  constructor({ field, message, keyword, statusCode = 400 }) {
    super({ message, type: "ValidationError" });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ModelValidationError);
    }

    this.name = "ModelValidationError";
    this.data = {};
    this.data[field] = [{ message, keyword }];
    this.statusCode = statusCode;
  }
}

module.exports = ModelValidationError;
