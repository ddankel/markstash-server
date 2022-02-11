const mockAuth0Authentication = require("./mockAuth0Authentication");

const mockExpressApp = () => {
  mockAuth0Authentication();

  const app = require("../../../src/app");
  return app;
};

module.exports = mockExpressApp;
