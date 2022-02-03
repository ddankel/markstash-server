const { ValidationError } = require("objection");
const groupFactory = require("../../../tests/factories/groupFactory");
const linkFactory = require("../../../tests/factories/linkFactory");

it("has a valid factory", async () => {
  const link = await linkFactory.create();
  expect(link).toBeTruthy();
});

describe(".ordinal", () => {
  it("invalidates when not unique in group", async () => {
    const group = await groupFactory.create();
    const props = { groupPid: group.pid, ordinal: 2 };
    await linkFactory.create(props);
    await expect(async () => {
      return await linkFactory.create(props);
    }).rejects.toThrow(ValidationError);
  });

  it("defaults to 0 for first in group", async () => {
    const link = await linkFactory.create({ ordinal: undefined });
    expect(link.ordinal).toBe(1);
  });

  it("defaults to max+1 for subsequent in group", async () => {
    const group = await groupFactory.create();
    await linkFactory.create({ groupPid: group.pid, ordinal: 5 });
    const link = await linkFactory.create({ groupPid: group.pid, ordinal: undefined });
    expect(link.ordinal).toBe(6);
  });

  it("default ignores ordinals in different group", async () => {
    const group = await groupFactory.create();
    await linkFactory.create({ groupPid: group.pid, ordinal: 5 });

    const group2 = await groupFactory.create();
    const link = await linkFactory.create({ groupPid: group2.pid, ordinal: undefined });
    expect(link.ordinal).toBe(1);
  });
});
