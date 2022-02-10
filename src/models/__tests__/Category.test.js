const { ValidationError } = require("objection");
const { categoryFactory, userFactory } = require("../../../tests/factories");

afterEach(() => {
  jest.clearAllMocks();
});

it("has a valid factory", async () => {
  const category = await categoryFactory.create();
  expect(category).toBeTruthy();
});

describe(".ordinal", () => {
  beforeEach(async () => {
    userPid = (await userFactory.create()).pid;
  });

  it("invalidates when not unique per user", async () => {
    await categoryFactory.create({ ordinal: 2, userPid });
    await expect(async () => {
      return await categoryFactory.create({ ordinal: 2, userPid });
    }).rejects.toThrow(ValidationError);
  });

  it("defaults to 1 for a user's first category", async () => {
    const category = await categoryFactory.create({ ordinal: undefined });
    expect(category.ordinal).toBe(1);
  });

  it("defaults to max+1 for user's subsequent categories", async () => {
    await categoryFactory.create({ ordinal: 5, userPid });
    const category = await categoryFactory.create({ ordinal: undefined, userPid });
    expect(category.ordinal).toBe(6);
  });

  it("ignores ordinals in other users' categories", async () => {
    await categoryFactory.create({ ordinal: 5 });
    const category = await categoryFactory.create({ ordinal: undefined, userPid });
    expect(category.ordinal).toBe(1);
  });
});

describe("#owner", () => {
  it("returns the parent's owner", async () => {
    const user = await userFactory.create();
    const category = await categoryFactory.create({ userPid: user.pid });

    subject = await category.owner();

    expect(subject).toEqual(await user.$reload());
  });
});
