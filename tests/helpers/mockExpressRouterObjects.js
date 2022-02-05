const userFactory = require("../factories/userFactory");
const mockStrongParams = require("./mockStrongParams");

const mockExpressRouterObjects = async ({ currentUser, strongParams, params }) => {
  let _currentUser = currentUser || (await userFactory.create());
  let _strongParams = strongParams;
  let _params = params;

  // Holds data that is rendered by sendData for validation
  let _renderedData = undefined;

  const update = async (newParams) =>
    await mockExpressRouterObjects({
      currentUser: _currentUser,
      strongParams: _strongParams,
      params: _params,
      ...newParams,
    });

  // Get the value of _renderedData
  const renderedData = () => _renderedData;

  // Mock for the res.sendData method
  const sendData = jest.fn(function (data) {
    _renderedData = data;
    return this;
  });

  // Mock for the res.status method
  const status = jest.fn(function () {
    return this;
  });

  // Mock express request object
  const req = {
    currentUser: _currentUser, //   Mocks attachCurrentUser middleware
    authorize: (val) => val, //     Mocks attachAuthorizer middleware
    parameters: !!_strongParams ? mockStrongParams(_strongParams) : undefined,
    params: _params,
  };

  // Mock express response object
  const res = {
    sendData,
    status,
  };

  return {
    update,
    renderedData,
    currentUser: _currentUser,
    req,
    res,
    sendData,
    status,
  };
};

module.exports = mockExpressRouterObjects;
