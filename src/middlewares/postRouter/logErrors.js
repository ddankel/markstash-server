const fs = require("fs");

const enabledEnvironments = ["development", "swagger"];

/**
 * The current datetime
 *
 * @return  {String}
 */
const now = () => {
  var m = new Date();
  var dateString =
    m.getUTCFullYear() +
    "/" +
    ("0" + (m.getUTCMonth() + 1)).slice(-2) +
    "/" +
    ("0" + m.getUTCDate()).slice(-2) +
    " " +
    ("0" + m.getUTCHours()).slice(-2) +
    ":" +
    ("0" + m.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + m.getUTCSeconds()).slice(-2);

  return dateString + " UTC";
};

/**
 * Build an error report to display
 *
 * @param   {Error}  error   Error to log
 *
 * @return  {String}
 */
const errorReport = (error) =>
  [now() + " " + "-".repeat(60), error.stack, JSON.stringify(error, null, 2)].join("\n");

/**
 * Log any error to the console
 *
 * Errors are logged to the console only if the current environment is one
 * specified in enabmedEnvironments above.
 */
const consoleLogErrors = (error, req, res, next) => {
  const currentEnv = req.app.get("env") || "undefined";
  if (!enabledEnvironments.includes(currentEnv)) {
    next(error);
    return;
  }

  console.log(errorReport(error));
  next(error);
};

/**
 * Log any errors
 *
 * Errors are logged to logs/<environment>.log, but only for environments
 * specified in the enabledEnvironments setting above.
 *
 * In a production application this would be replaced with more robust error
 * logging and/or integration with an error monitoring service.
 *
 * Errors are passed on to the next error handling middleware for further
 * processing.
 */
const logErrors = (error, req, res, next) => {
  const currentEnv = req.app.get("env") || "undefined";
  if (!enabledEnvironments.includes(currentEnv)) {
    next(error);
    return;
  }

  const logFile = `./logs/${currentEnv}.log`;
  if (!fs.existsSync("./logs/")) {
    fs.mkdirSync("./logs/");
  }

  fs.appendFileSync(logFile, "\n" + errorReport(error));
  next(error);
};

module.exports = {
  logErrors,
  consoleLogErrors,
};
