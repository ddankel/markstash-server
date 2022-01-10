const moveToCategory = require("./move_to_category");

const Collection = require("../../../models/collection");
const collectionFactory = require("../../../../tests/factories/collection");
const categoryFactory = require("../../../../tests/factories/category");

describe("When the collection is already associated with the category and column", () => {
  beforeEach(async () => {
    column = 2;
    category = await categoryFactory.create();
    collection = await collectionFactory.create({ categoryPid: category.pid, column });
  });

  it("returns the unchanged collection", async () => {
    const subject = await moveToCategory(collection, category);

    expect(subject).toEqual(collection);
  });
});

describe("When the collection is not already associated with the category", () => {
  beforeEach(async () => {
    column = 2;
    category = await categoryFactory.create();
    await collectionFactory.create({ categoryPid: category.pid, column, ordinal: 3 });
    collection = await collectionFactory.create();
  });

  it("returns the new collection", async () => {
    const subject = await moveToCategory(collection, category, column);

    expect(subject).toBeInstanceOf(Collection);
    expect(subject).toMatchObject({
      pid: collection.pid,
      ordinal: 4,
      column: column,
    });
  });
});

describe("When the collection is in the wrong column", () => {
  beforeEach(async () => {
    column = 2;
    category = await categoryFactory.create();
    await collectionFactory.create({ categoryPid: category.pid, column, ordinal: 3 });
    collection = await collectionFactory.create({ categoryPid: category.pid, column: 1 });
  });

  it("returns the new collection", async () => {
    const subject = await moveToCategory(collection, category, column);

    expect(subject).toBeInstanceOf(Collection);
    expect(subject).toMatchObject({
      pid: collection.pid,
      ordinal: 4,
      column: column,
    });
  });
});
