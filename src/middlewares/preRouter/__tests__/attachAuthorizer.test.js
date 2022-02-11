const attachAuthorizer = require("../attachAuthorizer");
const userFactory = require("../../../../tests/factories/userFactory");
const { HttpUnauthorizedError } = require("../../../lib/errors");
const categoryFactory = require("../../../../tests/factories/categoryFactory");

beforeEach(async () => {
  currentUser = await userFactory.create();

  mockRequest = {};
  mockResponse = {};
  mockNext = jest.fn();
});

it("binds the authorization function to req.authorize()", () => {
  attachAuthorizer(mockRequest, mockResponse, mockNext);

  expect(typeof mockRequest.authorize).toBe("function");
});

describe("when currentUser is blank", () => {
  it("raises HttpUnauthorizedError", async () => {
    attachAuthorizer(mockRequest, mockResponse, mockNext);

    await expect(async () => await mockRequest.authorize()).rejects.toThrow(HttpUnauthorizedError);
  });
});

describe("when an instance has the incorrect owner", () => {
  it("raises HttpUnauthorizedError", async () => {
    const category = await categoryFactory.create();

    mockRequest.currentUser = currentUser;
    attachAuthorizer(mockRequest, mockResponse, mockNext);

    await expect(async () => await mockRequest.authorize(category)).rejects.toThrow(
      HttpUnauthorizedError
    );
  });
});

describe("when an instance has the correct owner", () => {
  it("returns the instance", async () => {
    const category = await categoryFactory.create({ userPid: currentUser.pid });

    mockRequest.currentUser = currentUser;
    attachAuthorizer(mockRequest, mockResponse, mockNext);

    subject = await mockRequest.authorize(category);

    expect(subject).toEqual(category);
  });
});
