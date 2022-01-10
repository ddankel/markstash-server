const relocateCollection = require("./");

const collectionFactory = require("../../../../tests/factories/collection");
const categoryFactory = require("../../../../tests/factories/category");

const moveToCategory = require("./move_to_category");
const moveItemToOrdinal = require("../shared/move_item_to_ordinal");
const compactOrdinals = require("../shared/compact_ordinals");

jest.mock("./move_to_category");
jest.mock("../shared/move_item_to_ordinal");
jest.mock("../shared/compact_ordinals");

beforeEach(async () => {
  moveToCategory.mockImplementation(() => {});
  moveItemToOrdinal.mockImplementation(() => {});
  compactOrdinals.mockImplementation(() => "some result");

  category = await categoryFactory.create();
  collection = await collectionFactory.create({ ordinal: 3 });
  list = expect.any(Array);
  ordinal = 1;
  column = 2;
  knexTxn = expect.any(Function);
});

describe("when ran successfully", () => {
  beforeEach(async () => {
    subject = await relocateCollection({ collection, category, column, ordinal });
  });

  it("Pass the objects through the sub-librarires", async () => {
    expect(moveToCategory).toHaveBeenCalledWith(collection, category, column, knexTxn);
    expect(moveItemToOrdinal).toHaveBeenCalledWith(collection, list, ordinal, knexTxn);
    expect(compactOrdinals).toHaveBeenCalledWith(list, knexTxn);
  });

  it("Returns the sorted list of categories", async () => {
    expect(subject).toBe("some result");
  });
});

describe("when one of the libs error", () => {
  beforeEach(() => {
    compactOrdinals.mockImplementation(() => {
      throw new Error();
    });
  });

  it("does not update any records", async () => {
    expect.assertions(3);
    try {
      await relocateCollection({ collection, category, column, ordinal });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const subject = await collection.$reload();

      expect(subject.categoryPid).not.toEqual(category.pid);
      expect(subject.ordinal).toEqual(3);
    }
  });
});
