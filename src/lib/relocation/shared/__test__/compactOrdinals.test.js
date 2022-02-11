const compactOrdinals = require("../compactOrdinals");
const collectionFactory = require("../../../../../tests/factories/collectionFactory");

beforeEach(async () => {
  collectionC = await collectionFactory.create({ ordinal: 4 });
  collectionA = await collectionFactory.create({ ordinal: 1 });
  collectionB = await collectionFactory.create({ ordinal: 3 });
  collectionD = await collectionFactory.create({ ordinal: 7 });

  list = [collectionC, collectionA, collectionB, collectionD];
});

it("removes empty spaces in the ordinal sequence", async () => {
  const subject = await compactOrdinals(list);

  expect(collectionA.ordinal).toBe(1);
  expect(collectionB.ordinal).toBe(2);
  expect(collectionC.ordinal).toBe(3);
  expect(collectionD.ordinal).toBe(4);
});

it("updates the items in the database", async () => {
  const subject = await compactOrdinals(list);

  expect((await collectionA.$reload()).ordinal).toBe(1);
  expect((await collectionB.$reload()).ordinal).toBe(2);
  expect((await collectionC.$reload()).ordinal).toBe(3);
  expect((await collectionD.$reload()).ordinal).toBe(4);
});

it("returns the ordered items", async () => {
  const subject = await compactOrdinals(list);

  expect(subject).toEqual([
    await collectionA.$reload(),
    await collectionB.$reload(),
    await collectionC.$reload(),
    await collectionD.$reload(),
  ]);
});
