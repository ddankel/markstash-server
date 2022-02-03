const { ParameterMissingError } = require("strong-params");

const handleStrongParamErrors = (error, req, res, next) => {
  if (error instanceof ParameterMissingError) {
    return res.status(400).sendError({
      message: error.message,
      type: "ParameterMissingError",
      data: error.data || {},
    });
  }
  next(error);
};

module.exports = handleStrongParamErrors;
