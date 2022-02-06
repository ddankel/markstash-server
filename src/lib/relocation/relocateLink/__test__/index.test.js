const relocateLink = require("..");

const { linkFactory, groupFactory } = require("../../../../../tests/factories");
const moveToGroup = require("../moveToGroup");
const moveItemToOrdinal = require("../../shared/moveItemToOrdinal");
const compactOrdinals = require("../../shared/compactOrdinals");

jest.mock("../moveToGroup");
jest.mock("../../shared/moveItemToOrdinal");
jest.mock("../../shared/compactOrdinals");

beforeEach(async () => {
  moveToGroup.mockImplementation(() => {});
  moveItemToOrdinal.mockImplementation(() => {});
  compactOrdinals.mockImplementation(() => "some result");

  group = await groupFactory.create();
  link = await linkFactory.create({ ordinal: 3 });
  list = expect.any(Array);
  ordinal = 1;
  knexTxn = expect.any(Function);
});

describe("when ran successfully", () => {
  beforeEach(async () => {
    subject = await relocateLink({ link, group, ordinal });
  });

  it("passes the objects through the sub-libraries", () => {
    expect(moveToGroup).toHaveBeenCalledWith(link, group, knexTxn);
    expect(moveItemToOrdinal).toHaveBeenCalledWith(link, list, ordinal, knexTxn);
    expect(compactOrdinals).toHaveBeenCalledWith(list, knexTxn);
  });

  it("returns the result of compactOrdinals", () => {
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
      await relocateLink({ link, group, ordinal });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      const subject = await link.$reload();

      expect(subject.groupPid).not.toEqual(group.pid);
      expect(subject.ordinal).toEqual(3);
    }
  });
});
