const LinksController = require("../LinksController");
const userFactory = require("../../../tests/factories/userFactory");
const linkFactory = require("../../../tests/factories/linkFactory");
const Link = require("../../models/Link");
const mockExpressRouterObjects = require("../../../tests/helpers/mockExpressRouterObjects");
const groupFactory = require("../../../tests/factories/groupFactory");

beforeEach(async () => {
  currentUser = await userFactory.create();
  mock = await mockExpressRouterObjects({ currentUser });
});

describe("#index", () => {
  beforeEach(async () => {
    group = await groupFactory.create();
    targetLinks = await linkFactory.createList(2, { groupPid: group.pid });
    otherLink = await linkFactory.create();
    mock = await mock.update({ params: { group_pid: group.pid } });
    await LinksController.index(mock.req, mock.res);
  });

  it("renders just the links in the specified group", async () => {
    expect(mock.renderedData()).toEqual(await group.$relatedQuery("links"));
  });
});

describe("#create", () => {
  beforeEach(async () => {
    group = await groupFactory.create();
    linkAttributes = linkFactory.build();
    mock = await mock.update({
      params: { group_pid: group.pid },
      strongParams: { ...linkAttributes },
    });
    await LinksController.create(mock.req, mock.res);
  });

  it("creates a new link", async () => {
    links = await Link.query();
    expect(links.length).toBe(1);
    expect(links[0]).toMatchObject({ ...linkAttributes, groupPid: group.pid });
  });

  it("renders the new group", async () => {
    const link = await Link.query().first();
    expect(mock.renderedData()).toMatchObject(link);
    expect(mock.status).toHaveBeenCalledWith(201);
  });
});

describe("#show", () => {
  beforeEach(async () => {
    link = await linkFactory.create();
    mock = await mock.update({ params: { pid: link.pid } });
    await LinksController.show(mock.req, mock.res);
  });

  it("renders the category", () => {
    expect(mock.renderedData()).toEqual(link);
  });
});

describe("#update", () => {
  beforeEach(async () => {
    link = await linkFactory.create({ title: "original title" });
    mock = await mock.update({
      params: { pid: link.pid },
      strongParams: { title: "updated title" },
    });
    await LinksController.update(mock.req, mock.res);
  });

  it("updates the link record", async () => {
    const subject = await link.$reload();
    expect(subject.title).toBe("updated title");
  });

  it("renders the updated group", async () => {
    const subject = mock.renderedData();
    expect(subject).toEqual(await link.$reload());
  });
});
