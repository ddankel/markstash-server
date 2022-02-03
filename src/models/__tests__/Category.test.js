const { ValidationError } = require("objection");
const categoryFactory = require("../../../tests/factories/categoryFactory");

afterEach(() => {
  jest.clearAllMocks();
});

it("has a valid factory", async () => {
  const category = await categoryFactory.create();
  expect(category).toBeTruthy();
});

describe(".ordinal", () => {
  it("sets the default on create", async () => {
    const category1 = await categoryFactory.create({ title: "1", ordinal: undefined });
    expect(category1.ordinal).toBe(1);

    const category2 = await categoryFactory.create({ title: "2", ordinal: undefined });
    expect(category2.ordinal).toBe(2);

    await categoryFactory.create({ ordinal: 6 });

    const category3 = await categoryFactory.create({ title: "3", ordinal: undefined });
    expect(category3.ordinal).toBe(7);
  });

  it("sets the default on update", async () => {
    const category = await categoryFactory.create({ title: "1", ordinal: 5 });
    await category.$query().patch({ ordinal: undefined });
    expect(category.ordinal).toBe(1);

    await categoryFactory.create({ ordinal: 4 });
    await category.$query().patch({ ordinal: undefined });
    expect(category.ordinal).toBe(5);
  });

  it("prevents duplicates", async () => {
    await categoryFactory.create({ ordinal: 2 });
    await expect(async () => {
      return await categoryFactory.create({ ordinal: 2 });
    }).rejects.toThrow(ValidationError);
  });
});
