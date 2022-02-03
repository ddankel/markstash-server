const { ValidationError } = require("objection");
const collectionFactory = require("../../../tests/factories/collectionFactory");
const groupFactory = require("../../../tests/factories/groupFactory");

it("has a valid factory", async () => {
  const group = await groupFactory.create();
  expect(group).toBeTruthy();
});

describe(".ordinal", () => {
  it("invalidates when not unique in collection", async () => {
    const collection = await collectionFactory.create();
    const groupProps = { collectionPid: collection.pid, ordinal: 2 };
    await groupFactory.create(groupProps);
    await expect(async () => {
      return await groupFactory.create(groupProps);
    }).rejects.toThrow(ValidationError);
  });

  it("defaults to 2 for first in collection", async () => {
    const group = await groupFactory.create({ ordinal: undefined });
    expect(group.ordinal).toBe(2);
  });

  it("defaults to max+1 for subsequent in collection", async () => {
    const collection = await collectionFactory.create();
    await groupFactory.create({ collectionPid: collection.pid, ordinal: 5 });
    const group = await groupFactory.create({ collectionPid: collection.pid, ordinal: undefined });
    expect(group.ordinal).toBe(6);
  });

  it("default ignores ordinals in different collections", async () => {
    const collection = await collectionFactory.create();
    await groupFactory.create({ collectionPid: collection.pid, ordinal: 5 });

    const collection2 = await collectionFactory.create();
    const group = await groupFactory.create({ collectionPid: collection2.pid, ordinal: undefined });

    expect(group.ordinal).toBe(2);
  });
});
