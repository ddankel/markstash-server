const moveGroupToCollection = require("../moveGroupToCollection");
const Group = require("../../../../models/group");
const { groupFactory, collectionFactory } = require("../../../../../tests/factories");

describe("When the group is already associated with the collection", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create();
    group = await groupFactory.create({ collectionPid: collection.pid });
  });

  it("returns the unchanged group", async () => {
    const subject = await moveGroupToCollection(group, collection);

    expect(subject).toEqual(group);
  });
});

describe("When the group is not already associated with the collection", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create();
    await groupFactory.create({ collectionPid: collection.pid, ordinal: 3 });
    group = await groupFactory.create();
  });

  it("returns the new group", async () => {
    const subject = await moveGroupToCollection(group, collection);

    expect(subject).toBeInstanceOf(Group);
    expect(subject).toMatchObject({
      id: group.id,
      collectionPid: collection.pid,
      ordinal: 4,
    });
  });
});
