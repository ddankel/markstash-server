const moveItemToOrdinal = require("./move_item_to_ordinal");
const collectionFactory = require("../../../../tests/factories/collection");

describe("When collection already has the target ordinal", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create({ ordinal: 1 });
    list = [collection];
  });

  it("returns the initial collection", async () => {
    const subject = await moveItemToOrdinal(collection, list, 1);

    expect(subject).toEqual(collection);
  });

  it("does not update the collection in the database", async () => {
    const subject = await moveItemToOrdinal(collection, list, 1);

    expect(subject).toMatchObject(collection);
  });
});

describe("When the collection is not at the target ordinal", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create({ ordinal: 1 });
    list = [collection];
  });

  it("returns the updated collection with the correct ordinal", async () => {
    const subject = await moveItemToOrdinal(collection, list, 2);

    expect(subject).toMatchObject({
      ...collection,
      ordinal: 2,
    });
  });

  it("updates the collection in the database", async () => {
    const subject = await moveItemToOrdinal(collection, list, 2);

    expect(subject).toMatchObject(await collection.$reload());
  });
});

describe("When the target ordinal is occupied", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create({ ordinal: 3 });
    collectionA = await collectionFactory.create({ ordinal: 1 });
    collectionB = await collectionFactory.create({ ordinal: 2 });
    list = [collection, collectionA, collectionB];
  });

  it("returns the updated collection", async () => {
    const subject = await moveItemToOrdinal(collection, list, 1);

    expect(subject).toMatchObject({
      ...collection,
      ordinal: 1,
    });
  });

  it("updates the collection in the database", async () => {
    const subject = await moveItemToOrdinal(collection, list, 1);

    expect(subject).toMatchObject(await collection.$reload());
  });

  it("updates other collections to make space for the new one", async () => {
    await moveItemToOrdinal(collection, list, 1);

    expect((await collectionA.$reload()).ordinal).toBe(2);
    expect((await collectionB.$reload()).ordinal).toBe(3);
  });
});
