const mockExpressRouterObjects = require("../../../tests/helpers/mockExpressRouterObjects");
const ProfileController = require("../ProfileController");
const { userFactory } = require("../../../tests/factories");

beforeEach(async () => {
  currentUser = await userFactory.create();
  mock = await mockExpressRouterObjects({ currentUser });
});

describe("#show", () => {
  beforeEach(async () => {
    await ProfileController.show(mock.req, mock.res);
  });

  it("renders the current user", () => {
    expect(mock.renderedData()).toEqual(currentUser);
  });
});
