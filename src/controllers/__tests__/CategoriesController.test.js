const CategoriesController = require("../CategoriesController");
const userFactory = require("../../../tests/factories/userFactory");
const categoryFactory = require("../../../tests/factories/categoryFactory");
const Category = require("../../models/category");
const mockExpressRouterObjects = require("../../../tests/helpers/mockExpressRouterObjects");

beforeEach(async () => {
  currentUser = await userFactory.create();
  mock = await mockExpressRouterObjects({ currentUser });
});

describe("#index", () => {
  beforeEach(async () => {
    myCategory1 = await categoryFactory.create({ userPid: currentUser.pid });
    myCategory2 = await categoryFactory.create({ userPid: currentUser.pid });
    otherCategory = await categoryFactory.create();
    await CategoriesController.index(mock.req, mock.res);
  });

  it("renders just this user's categories", () => {
    expect(mock.renderedData()).toMatchIds([myCategory2, myCategory1]);
  });
});

describe("#create", () => {
  beforeEach(async () => {
    title = "a title";
    columns = 3;
    mock = await mock.update({ strongParams: { title, columns } });
    await CategoriesController.create(mock.req, mock.res);
  });

  it("creates a new category", async () => {
    categories = await Category.query();
    expect(categories.length).toBe(1);
    expect(categories[0]).toMatchObject({ title, columns });
  });

  it("renders the new category (status 201)", async () => {
    const category = await Category.query().first();
    expect(mock.renderedData()).toMatchObject({ title: category.title, columns: category.columns });
    expect(mock.renderedData()).toMatchIds(category);
    expect(mock.status).toHaveBeenCalledWith(201);
  });
});

describe("#show", () => {
  beforeEach(async () => {
    category = await categoryFactory.create({ userPid: currentUser.pid });
    mock = await mock.update({ params: { id: category.pid } });
    await CategoriesController.show(mock.req, mock.res);
  });

  it("renders the category", async () => {
    expect(mock.renderedData()).toMatchIds(category);
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
      params: { id: category.pid },
      strongParams: { title: "title2", columns: 3 },
    });
    await CategoriesController.update(mock.req, mock.res);
  });

  it("updates the category record", async () => {
    const subject = await Category.findByPid(category.pid);
    expect(subject).toMatchObject({ title: "title2", columns: 3 });
  });

  it("renders the updated category", async () => {
    expect(mock.renderedData()).toMatchIds(category);
    expect(mock.renderedData()).toMatchObject({ title: "title2", columns: 3 });
  });
});

describe("#destroy", () => {
  beforeEach(async () => {
    category = await categoryFactory.create({
      userPid: currentUser.pid,
      title: "title",
      columns: 1,
    });
    mock = await mock.update({ params: { id: category.pid } });
    await CategoriesController.destroy(mock.req, mock.res);
  });

  it("destroys the category record", async () => {
    const categories = await Category.query();
    expect(categories.length).toBe(0);
  });

  it("renders the destroyed categroy", async () => {
    expect(mock.renderedData()).toMatchIds(category);
    expect(mock.renderedData()).toMatchObject({ title: category.title, columns: category.columns });
  });
});
