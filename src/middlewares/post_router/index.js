const handleHTTPErrors = require("./handle_http_errors");
const handleObjectionJSErrors = require("./handle_objectionjs_errors");
const handleStrongParamErrors = require("./handle_param_errors");
const { logErrors, consoleLogErrors } = require("./log_errors");

const useMiddlewares = (app) => {
  app.use(consoleLogErrors); //         Log errors to the console
  app.use(logErrors); //                Log errors to a logfile
  app.use(handleStrongParamErrors); //  Handle responding if strong-params throws an error
  app.use(handleObjectionJSErrors); //  Handle responding if objectionjs throws an error
  app.use(handleHTTPErrors); //         Handle responding for common error types
};

module.exports = useMiddlewares;
