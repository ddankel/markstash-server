const attachCurrentUser = require("../attachCurrentUser");
const userFactory = require("../../../../tests/factories/userFactory");
const User = require("../../../models/User");

// Setup for tests
const auth0Id = "auth0|12345abcde";
const payload = { sub: auth0Id };
payload["http://org.auth0.markstash/username"] = "new name";

beforeEach(() => {
  mockRequest = {};
  mockResponse = {};
  mockNext = jest.fn();
});

describe("when req.auth.payload.sub is undefined", () => {
  beforeEach(async () => {
    mockRequest = { auth: { payload: {} } };
    await attachCurrentUser(mockRequest, mockResponse, mockNext);
  });

  it("does not create a new user", async () => {
    const subject = await (await User.query()).length;
    expect(subject).toBe(0);
  });

  it("does not set req.currentUser", () => {
    expect(mockRequest.currentUser).toBeUndefined();
  });

  it("calls next()", () => {
    expect(mockNext).toBeCalledTimes(1);
  });
});

describe("when the auth0Id does not match an existing user", () => {
  beforeEach(async () => {
    mockRequest = { auth: { payload } };
    await attachCurrentUser(mockRequest, mockResponse, mockNext);
  });

  it("creates a new user", async () => {
    const subject = await User.query().findOne({ auth0Id });
    expect(subject).toMatchObject({
      auth0Id,
      username: "new name",
    });
  });

  it("sets req.currentUser", () => {
    expect(mockRequest.currentUser).toMatchObject({
      auth0Id,
      username: "new name",
    });
  });

  it("calls next()", () => {
    expect(mockNext).toBeCalledTimes(1);
  });
});

describe("when the auth0Id matches an existing user", () => {
  beforeEach(async () => {
    mockRequest = { auth: { payload } };
    user = await userFactory.create({ auth0Id });
    await attachCurrentUser(mockRequest, mockResponse, mockNext);
  });

  it("updates the user's username", async () => {
    const subject = await User.query().findById(user.id);
    expect(subject.username).toBe("new name");
  });

  it("sets req.currentUser", () => {
    expect(mockRequest.currentUser).toMatchObject({
      id: user.id,
      auth0Id: user.auth0Id,
      username: "new name",
    });
  });

  it("calls next()", () => {
    expect(mockNext).toBeCalledTimes(1);
  });
});
