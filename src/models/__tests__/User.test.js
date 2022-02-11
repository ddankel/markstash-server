const userFactory = require("../../../tests/factories/userFactory");

afterEach(() => {
  jest.clearAllMocks();
});

it("has a valid factory", async () => {
  const user = await userFactory.create();
  expect(user).toBeTruthy();
});
