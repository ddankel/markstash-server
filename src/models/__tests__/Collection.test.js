const { ValidationError } = require("objection");
const categoryFactory = require("../../../tests/factories/categoryFactory");
const collectionFactory = require("../../../tests/factories/collectionFactory");

it("has a valid factory", async () => {
  const collection = await collectionFactory.create();
  expect(collection).toBeTruthy();
});

describe(".ordinal", () => {
  it("invalidates when not unique in column", async () => {
    // Validate on insert
    const category = await categoryFactory.create();
    const collectionProps = { categoryPid: category.pid, column: 1, ordinal: 2 };
    await collectionFactory.create(collectionProps);
    await expect(async () => {
      return await collectionFactory.create(collectionProps);
    }).rejects.toThrow(ValidationError);

    // Validate on patch
    const collection = await collectionFactory.create({ ...collectionProps, ordinal: 3 });
    await expect(async () => {
      return await collection.$query().patch({ ordinal: 2 });
    }).rejects.toThrow(ValidationError);
  });

  it("defaults to 0 for first in column", async () => {
    const collection = await collectionFactory.create({ ordinal: undefined });
    expect(collection.ordinal).toBe(1);
  });

  it("defaults to max+1 for subsequent in column", async () => {
    const category = await categoryFactory.create();
    await collectionFactory.create({ categoryPid: category.pid, column: 1, ordinal: 5 });
    const collection = await collectionFactory.create({
      categoryPid: category.pid,
      column: 1,
      ordinal: undefined,
    });
    expect(collection.ordinal).toBe(6);
  });

  it("default ignores ordinals on different categories", async () => {
    const category = await categoryFactory.create();
    await collectionFactory.create({ categoryPid: category.pid, column: 1, ordinal: 5 });

    const category2 = await categoryFactory.create();
    const collection = await collectionFactory.create({
      categoryPid: category2.pid,
      column: 1,
      ordinal: undefined,
    });
    expect(collection.ordinal).toBe(1);
  });

  it("default ignores ordinals on different columns", async () => {
    const category = await categoryFactory.create();
    await collectionFactory.create({ categoryPid: category.pid, column: 1, ordinal: 5 });

    const collection = await collectionFactory.create({
      categoryPid: category.pid,
      column: 2,
      ordinal: undefined,
    });
    expect(collection.ordinal).toBe(1);
  });
});

describe("on creation", () => {
  it("creates a default group", async () => {
    const collection = await collectionFactory.create({});

    const subject = await collection.$relatedQuery("groups");

    expect(subject.length).toBe(1);
    expect(subject[0].title).toBe("Default");
  });
});
