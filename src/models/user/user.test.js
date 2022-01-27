const { ValidationError } = require("objection");
const userFactory = require("../../../tests/factories/user");

afterEach(() => {
  jest.clearAllMocks();
});

it("has a valid factory", async () => {
  const user = await userFactory.create();
  expect(user).toBeTruthy();
});
