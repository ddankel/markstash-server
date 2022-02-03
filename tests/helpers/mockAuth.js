// const userFactory = require('../factories/user')

// TODO:
// change to withMockAuthMiddleware
// if user = false, mock unauthenticated (respond unauth)
// if user = true, mock authenticated and just build a rando user
// otherwise, mock middleware and set req user to param

const mockAuth = (user = true) => {
  jest.mock("../../src/middlewares/pre_router/auth0_authentication", () =>
    jest.fn((req, res, next) => {
      console.log("in auth mock");
      next();
    })
  );
  const app = require("../../src/app");
  return app;
};

module.exports = mockAuth;
