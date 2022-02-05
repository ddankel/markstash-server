const mockExpressRouterObjects = require("../../../tests/helpers/mockExpressRouterObjects");
const GroupsController = require("../GroupsController");
const { Group } = require("../../models");
const { collectionFactory, groupFactory } = require("../../../tests/factories");

const relocateGroup = require("../../lib/relocation/relocateGroup");
jest.mock("../../lib/relocation/relocateGroup");

beforeEach(async () => {
  mock = await mockExpressRouterObjects();
});

describe("#index", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create();
    targetGroups = await groupFactory.createList(2, { collectionPid: collection.pid });
    otherGroup = await groupFactory.create();
    mock = await mock.update({ params: { collection_pid: collection.pid } });
    await GroupsController.index(mock.req, mock.res);
  });

  it("renders just the groups in the specified collection", async () => {
    expect(mock.renderedData()).toEqual(await collection.$relatedQuery("groups"));
  });
});

describe("#create", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create();
    groupParams = groupFactory.build();
    mock = await mock.update({
      params: { collection_pid: collection.pid },
      strongParams: groupParams,
    });
    await GroupsController.create(mock.req, mock.res);
  });

  it("creates a new group", async () => {
    groups = await Group.query();
    expect(groups.length).toBe(2); // NOTE: collections spawn with a 'default' group
    expect(groups[1]).toMatchObject({ ...groupParams, collectionPid: collection.pid });
  });

  it("renders the new group", async () => {
    const group = (await Group.query())[1];
    expect(mock.renderedData()).toEqual(group);
    expect(mock.status).toHaveBeenCalledWith(201);
  });
});

describe("#show", () => {
  beforeEach(async () => {
    group = await groupFactory.create();
    mock = await mock.update({ params: { pid: group.pid } });
    await GroupsController.show(mock.req, mock.res);
  });

  it("renders the category", () => {
    expect(mock.renderedData()).toEqual(group);
  });
});

describe("#update", () => {
  beforeEach(async () => {
    group = await groupFactory.create({ title: "original title" });
    mock = await mock.update({
      params: { pid: group.pid },
      strongParams: { title: "updated title" },
    });
    await GroupsController.update(mock.req, mock.res);
  });

  it("updates the group record", async () => {
    const subject = await group.$reload();
    expect(subject.title).toBe("updated title");
  });

  it("renders the updated group", async () => {
    expect(mock.renderedData()).toEqual(await group.$reload());
  });
});

describe("#destroy", () => {
  beforeEach(async () => {
    group = await groupFactory.create();
    mock = await mock.update({ params: { pid: group.pid } });
    await GroupsController.destroy(mock.req, mock.res);
  });

  it("destroys the collection record", async () => {
    const groups = await Group.query();
    expect(groups.length).toBe(1); // NOTE: collections spawn with a 'default' group
  });

  it("renders the destroyed group", () => {
    expect(mock.renderedData()).toEqual(group);
  });
});

describe("#relocate", () => {
  beforeEach(async () => {
    relocateGroup.mockImplementation(() => "sorted list");
    group = await groupFactory.create();
    collection = await collectionFactory.create();
    mock = await mock.update({
      params: { pid: group.pid },
      strongParams: { collectionPid: collection.pid, ordinal: 2 },
    });
    await GroupsController.relocate(mock.req, mock.res);
  });

  it("calls the relocation library", () => {
    expect(relocateGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        group: expect.objectContaining({ pid: group.pid }),
        collection: expect.objectContaining({ pid: collection.pid }),
        ordinal: 2,
      })
    );
  });

  it("renders the result of the relocation call", () => {
    expect(mock.renderedData()).toEqual("sorted list");
  });
});
