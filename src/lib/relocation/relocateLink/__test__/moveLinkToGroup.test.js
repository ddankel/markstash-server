const moveLinkToGroup = require("../moveLinkToGroup");

const Link = require("../../../../models/link");
const { linkFactory, groupFactory } = require("../../../../../tests/factories");

describe("when the link is already associated with the group", () => {
  beforeEach(async () => {
    group = await groupFactory.create();
    link = await linkFactory.create({ groupPid: group.pid });
  });

  it("returns the unchanged link", async () => {
    const subject = await moveLinkToGroup(link, group);

    expect(subject).toEqual(link);
  });
});

describe("when the link is not already associated with the group", () => {
  beforeEach(async () => {
    group = await groupFactory.create();
    await linkFactory.create({ groupPid: group.pid, ordinal: 3 });
    link = await linkFactory.create();
  });

  it("returns the new link", async () => {
    const subject = await moveLinkToGroup(link, group);

    expect(subject).toBeInstanceOf(Link);
    expect(subject).toMatchObject({
      id: link.id,
      groupPid: group.pid,
      ordinal: 4,
    });
  });
});
