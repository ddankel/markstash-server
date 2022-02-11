const request = require("supertest");
const { userFactory, collectionFactory, categoryFactory } = require("../factories");
const mockExpressApp = require("../helpers/mockExpressApp");
const { itBehavesLike } = require("../sharedExamples");

const app = mockExpressApp();

describe("GET /categories/1/collections", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).get("/categories/1/collections").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 200 OK with the user's categories", async () => {
      const currentUser = await userFactory.create();
      const category = await categoryFactory.create({ userPid: currentUser.pid });
      const collections = await collectionFactory.createList(3, { categoryPid: category.pid });
      const response = await request(app)
        .get(`/categories/${category.pid}/collections`)
        .set("Authorization", currentUser.auth0Id);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toMatchPids(collections);
    });
  });
});

describe("POST /categories/1/collections", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).post("/categories/1/collections").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 201 with the new instance", async () => {
      const currentUser = await userFactory.create();
      const collectionAttributes = { title: "new title" };
      const category = await categoryFactory.create({ userPid: currentUser.pid });
      const response = await request(app)
        .post(`/categories/${category.pid}/collections`)
        .set("Authorization", currentUser.auth0Id)
        .send({ collection: collectionAttributes });

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toMatchObject({
        ...collectionAttributes,
        ordinal: 1,
        categoryPid: category.pid,
      });
    });
  });
});

describe("GET /collections/:pid", () => {
  itBehavesLike("aControllerShowAction", {
    factory: collectionFactory,
    url: "/collections/:pid",
  });
});

describe("PATCH /collections/:pid", () => {
  itBehavesLike("aControllerUpdateAction", {
    factory: collectionFactory,
    url: "/collections/:pid",
    updateAttributes: { collection: { title: "new title" } },
  });
});

describe("DELETE /collections/:pid", () => {
  itBehavesLike("aControllerDeleteAction", {
    factory: collectionFactory,
    url: "/collections/:pid",
  });
});
