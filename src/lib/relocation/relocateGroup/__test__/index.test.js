const relocateGroup = require("..");

const collectionFactory = require("../../../../../tests/factories/collectionFactory");
const groupFactory = require("../../../../../tests/factories/groupFactory");

const moveToCollection = require("../moveToCollection");
const moveItemToOrdinal = require("../../shared/moveItemToOrdinal");
const compactOrdinals = require("../../shared/compactOrdinals");

jest.mock("../moveToCollection");
jest.mock("../../shared/moveItemToOrdinal");
jest.mock("../../shared/compactOrdinals");

beforeEach(async () => {
  moveToCollection.mockImplementation(() => {});
  moveItemToOrdinal.mockImplementation(() => {});
  compactOrdinals.mockImplementation(() => "some result");

  collection = await collectionFactory.create();
  group = await groupFactory.create({ ordinal: 3 });
  list = expect.any(Array);
  ordinal = 1;
  column = 2;
  knexTxn = expect.any(Function);
});

describe("when ran successfully", () => {
  beforeEach(async () => {
    subject = await relocateGroup({ group, collection, ordinal });
  });

  it("Pass the objects through the sub-librarires", async () => {
    expect(moveToCollection).toHaveBeenCalledWith(group, collection, knexTxn);
    expect(moveItemToOrdinal).toHaveBeenCalledWith(group, list, ordinal, knexTxn);
    expect(compactOrdinals).toHaveBeenCalledWith(list, knexTxn);
  });

  it("Returns the sorted list of groups", async () => {
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
      await relocateGroup({ group, collection, ordinal });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const subject = await group.$reload();

      expect(subject.collectionPid).not.toEqual(collection.pid);
      expect(subject.ordinal).toEqual(3);
    }
  });
});
