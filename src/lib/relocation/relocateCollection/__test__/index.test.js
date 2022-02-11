const relocateCollection = require("..");
const { collectionFactory, categoryFactory } = require("../../../../../tests/factories");

const moveCollectionToCategory = require("../moveCollectionToCategory");
const moveItemToOrdinal = require("../../shared/moveItemToOrdinal");
const compactOrdinals = require("../../shared/compactOrdinals");

jest.mock("../moveCollectionToCategory");
jest.mock("../../shared/moveItemToOrdinal");
jest.mock("../../shared/compactOrdinals");

beforeEach(async () => {
  moveCollectionToCategory.mockImplementation(() => {});
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
    expect(moveCollectionToCategory).toHaveBeenCalledWith(collection, category, column, knexTxn);
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
