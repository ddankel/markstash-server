const relocateGroup = require("./");

const collectionFactory = require("../../../../tests/factories/collection");
const groupFactory = require("../../../../tests/factories/group");

const moveToCollection = require("./move_to_collection");
const moveItemToOrdinal = require("../shared/move_item_to_ordinal");
const compactOrdinals = require("../shared/compact_ordinals");

jest.mock("./move_to_collection");
jest.mock("../shared/move_item_to_ordinal");
jest.mock("../shared/compact_ordinals");

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
