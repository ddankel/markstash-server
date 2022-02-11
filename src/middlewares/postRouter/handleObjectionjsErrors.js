const {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} = require("objection");

// @see https://vincit.github.io/objection.js/recipes/error-handling.html#examples

// In this example `res` is an express response object.
const handleObjectionjsErrors = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    switch (error.type) {
      case "ModelValidation":
        res.status(400).sendError({
          message: error.message,
          type: error.type,
          data: error.data,
        });
        break;
      case "RelationExpression":
        res.status(400).sendError({
          message: error.message,
          type: "RelationExpression",
          data: {},
        });
        break;
      case "UnallowedRelation":
        res.status(400).sendError({
          message: error.message,
          type: error.type,
          data: {},
        });
        break;
      case "InvalidGraph":
        res.status(400).sendError({
          message: error.message,
          type: error.type,
          data: {},
        });
        break;
      default:
        res.status(400).sendError({
          message: error.message,
          type: "UnknownValidationError",
          data: {},
        });
        break;
    }
  } else if (error instanceof NotFoundError) {
    res.status(404).sendError({
      message: error.message,
      type: "NotFound",
      data: {},
    });
  } else if (error instanceof UniqueViolationError) {
    res.status(409).sendError({
      message: error.message,
      type: "UniqueViolation",
      data: {
        columns: error.columns,
        table: error.table,
        constraint: error.constraint,
      },
    });
  } else if (error instanceof NotNullViolationError) {
    res.status(400).sendError({
      message: error.message,
      type: "NotNullViolation",
      data: {
        column: error.column,
        table: error.table,
      },
    });
  } else if (error instanceof ForeignKeyViolationError) {
    res.status(409).sendError({
      message: error.message,
      type: "ForeignKeyViolation",
      data: {
        table: error.table,
        constraint: error.constraint,
      },
    });
  } else if (error instanceof CheckViolationError) {
    res.status(400).sendError({
      message: error.message,
      type: "CheckViolation",
      data: {
        table: error.table,
        constraint: error.constraint,
      },
    });
  } else if (error instanceof DataError) {
    res.status(400).sendError({
      message: error.message,
      type: "InvalidData",
      data: {},
    });
  } else if (error instanceof DBError) {
    res.status(500).sendError({
      message: error.message,
      type: "UnknownDatabaseError",
      data: {},
    });
  } else {
    next(error);
  }
};

module.exports = handleObjectionjsErrors;
