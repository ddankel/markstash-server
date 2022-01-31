const userFactory = require("../factories/user");
const mockStrongParams = require("./mock_strong_params");

const mockExpressRouterObjects = async ({ currentUser, strongParams }) => {
  // Holds data that is rendered by sendData for validation
  let _renderedData = undefined;

  // Fetch the value of _renderedData
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

  // Build a user for the header if one was not provided
  if (!currentUser) currentUser = await userFactory.create();

  // Mock the express request object
  const req = { currentUser };

  // Mock the express response object
  const res = { sendData, status };

  // Mock strong params (if provided)
  if (strongParams) req.parameters = mockStrongParams(strongParams);

  const reMock = (params) => mockExpressRouterObjects({ currentUser, ...params });

  return {
    reMock,
    renderedData,
    sendData,
    status,
    currentUser,
    req,
    res,
  };
};

module.exports = mockExpressRouterObjects;
