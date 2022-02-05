const express = require("express");
const auth0Authentication = require("./auth0Authentication");
const attachCurrentUser = require("./attachCurrentUser");
const attachErrorResponder = require("./attachErrorResponder");
const attachSenders = require("./attachSenders");
const params = require("strong-params");
const attachAuthorizer = require("./attachAuthorizer");

const useMiddlewares = (app) => {
  app.use(express.json()); //              Format request body as json
  app.use(auth0Authentication); //         Authenticate Bearer token with Auth0
  app.use(attachCurrentUser); //           Find or create currentUser from auth0 user id
  app.use(attachAuthorizer); //            Attach model authorization checker
  app.use(attachErrorResponder); //        Attach responders for common errors/responses
  app.use(attachSenders); //               Attach sendData and sendError helpers
  app.use(params.expressMiddleware()); //  Implement rails-style strong params
};

module.exports = useMiddlewares;
