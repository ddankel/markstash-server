const CollectionsController = require("../CollectionsController");
const userFactory = require("../../../tests/factories/userFactory");
const collectionFactory = require("../../../tests/factories/collectionFactory");
const Collection = require("../../models/Collection");
const mockExpressRouterObjects = require("../../../tests/helpers/mockExpressRouterObjects");
const categoryFactory = require("../../../tests/factories/categoryFactory");

const relocateCollection = require("../../lib/relocation/relocateCollection");
jest.mock("../../lib/relocation/relocateCollection");

beforeEach(async () => {
  currentUser = await userFactory.create();
  mock = await mockExpressRouterObjects({ currentUser });
});

describe("#index", () => {
  beforeEach(async () => {
    category = await categoryFactory.create({ userPid: currentUser.pid });
    myCollection1 = await collectionFactory.create({ categoryPid: category.pid });
    myCollection2 = await collectionFactory.create({ categoryPid: category.pid });
    otherCollection = await collectionFactory.create();
    mock = await mock.update({ params: { category_pid: category.pid } });
    await CollectionsController.index(mock.req, mock.res);
  });

  it("renders just this user's collections", () => {
    expect(mock.renderedData()).toMatchIds([myCollection1, myCollection2]);
  });
});

describe("#create", () => {
  beforeEach(async () => {
    category = await categoryFactory.create();
    title = "sample title";
    mock = await mock.update({
      params: { category_pid: category.pid },
      strongParams: { title },
    });
    await CollectionsController.create(mock.req, mock.res);
  });

  it("creates a new collection", async () => {
    collections = await Collection.query();
    expect(collections.length).toBe(1);
    expect(collections[0]).toMatchObject({ title, categoryPid: category.pid });
  });

  it("renders the new collection", async () => {
    const collection = await Collection.query().first();
    expect(mock.renderedData()).toMatchObject(collection);
    expect(mock.status).toHaveBeenCalledWith(201);
  });
});

describe("#show", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create();
    mock = await mock.update({ params: { pid: collection.pid } });
    await CollectionsController.show(mock.req, mock.res);
  });

  it("renders the category", async () => {
    expect(mock.renderedData()).toMatchIds(collection);
  });
});

describe("#update", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create({
      title: "initial title",
    });
    mock = await mock.update({
      params: { pid: collection.pid },
      strongParams: { title: "updated title" },
    });
    await CollectionsController.update(mock.req, mock.res);
  });

  it("update the collection record", async () => {
    const subject = await collection.$reload();
    expect(subject.title).toBe("updated title");
  });

  it("renders the updated category", async () => {
    expect(mock.renderedData()).toMatchObject(await collection.$reload());
  });
});

describe("#destroy", () => {
  beforeEach(async () => {
    collection = await collectionFactory.create();
    mock = await mock.update({ params: { pid: collection.pid } });
    await CollectionsController.destroy(mock.req, mock.res);
  });

  it("destroys the collection record", async () => {
    const collections = await Collection.query();
    expect(collections.length).toBe(0);
  });

  it("renders the destroyed collection", () => {
    expect(mock.renderedData()).toMatchObject(collection);
  });
});

describe("#relocate", () => {
  beforeEach(async () => {
    relocateCollection.mockImplementation(() => "sorted_list");

    category = await categoryFactory.create();
    collection = await collectionFactory.create();
    mock = await mock.update({
      params: { pid: collection.pid },
      strongParams: { categoryPid: category.pid, column: 1, ordinal: 2 },
    });
    await CollectionsController.relocate(mock.req, mock.res);
  });

  it("calls the relocation library", () => {
    expect(relocateCollection).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: expect.objectContaining({ pid: collection.pid }),
        category: expect.objectContaining({ pid: category.pid }),
        column: 1,
        ordinal: 2,
      })
    );
  });

  it("renders the result of the relocation call", () => {
    expect(mock.renderedData()).toEqual("sorted_list");
  });
});
