const mockExpressRouterObjects = require("../../../tests/helpers/mockExpressRouterObjects");
const CategoriesController = require("../CategoriesController");
const { Category } = require("../../models");
const { userFactory, categoryFactory } = require("../../../tests/factories");

beforeEach(async () => {
  currentUser = await userFactory.create();
  mock = await mockExpressRouterObjects({ currentUser });
});

describe("#index", () => {
  beforeEach(async () => {
    myCategory1 = await categoryFactory.create({ userPid: currentUser.pid, ordinal: 2 });
    myCategory2 = await categoryFactory.create({ userPid: currentUser.pid, ordinal: 1 });
    otherCategory = await categoryFactory.create();
    await CategoriesController.index(mock.req, mock.res);
  });

  it("renders just this user's categories, sorted by ordinal", () => {
    expect(mock.renderedData()).toEqual([myCategory2, myCategory1]);
  });
});

describe("#create", () => {
  beforeEach(async () => {
    categoryParams = categoryFactory.build();
    mock = await mock.update({ strongParams: categoryParams });
    await CategoriesController.create(mock.req, mock.res);
  });

  it("creates a new category", async () => {
    categories = await Category.query();
    expect(categories.length).toBe(1);
    expect(categories[0]).toMatchObject({ ...categoryParams, userPid: currentUser.pid });
  });

  it("renders the new category (status 201)", async () => {
    const category = await Category.query().first();
    expect(mock.renderedData()).toMatchObject(category);
    expect(mock.status).toHaveBeenCalledWith(201);
  });
});

describe("#show", () => {
  beforeEach(async () => {
    category = await categoryFactory.create({ userPid: currentUser.pid });
    mock = await mock.update({ params: { pid: category.pid } });
    await CategoriesController.show(mock.req, mock.res);
  });

  it("renders the category", async () => {
    expect(mock.renderedData()).toEqual(category);
  });
});

describe("#update", () => {
  beforeEach(async () => {
    category = await categoryFactory.create({
      userPid: currentUser.pid,
      title: "title",
      columns: 1,
    });
    mock = await mock.update({
      params: { pid: category.pid },
      strongParams: { title: "title2", columns: 3 },
    });
    await CategoriesController.update(mock.req, mock.res);
  });

  it("updates the category record", async () => {
    const subject = await category.$reload();
    expect(subject).toMatchObject({ title: "title2", columns: 3 });
  });

  it("renders the updated category", async () => {
    expect(mock.renderedData()).toEqual(await category.$reload());
  });
});

describe("#destroy", () => {
  beforeEach(async () => {
    category = await categoryFactory.create();
    mock = await mock.update({ params: { pid: category.pid } });
    await CategoriesController.destroy(mock.req, mock.res);
  });

  it("destroys the category record", async () => {
    const categories = await Category.query();
    expect(categories.length).toBe(0);
  });

  it("renders the destroyed category", async () => {
    expect(mock.renderedData()).toMatchObject(category);
  });
});
