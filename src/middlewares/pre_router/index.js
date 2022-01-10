const express = require("express");
const attachErrorResponder = require("./attach_error_responder");
const responseSenders = require("./senders");
const params = require("strong-params");

const useMiddlewares = (app) => {
  app.use(express.json()); //              Format request body as json
  app.use(attachErrorResponder); //        Attach responders for common errors/responses
  app.use(responseSenders); //             Attach sendData and sendError helpers
  app.use(params.expressMiddleware()); //  Implement rails-style strong params
};

module.exports = useMiddlewares;
