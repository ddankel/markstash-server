const request = require("supertest");
const { userFactory, categoryFactory } = require("../factories");
const mockExpressApp = require("../helpers/mockExpressApp");
const { itBehavesLike } = require("../sharedExamples");

const app = mockExpressApp();

describe("GET /categories", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).get("/categories").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 200 OK with the user's categories", async () => {
      const currentUser = await userFactory.create();
      const categories = await categoryFactory.createList(3, { userPid: currentUser.pid });
      const response = await request(app)
        .get("/categories")
        .set("Authorization", currentUser.auth0Id);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toMatchPids(categories);
    });
  });
});

describe("POST /categories", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).post("/categories").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 201 with the new instance", async () => {
      const currentUser = await userFactory.create();
      const categoryAttributes = { title: "test title" };
      const response = await request(app)
        .post("/categories")
        .set("Authorization", currentUser.auth0Id)
        .send({ category: categoryAttributes });

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toMatchObject({
        ...categoryAttributes,
        columns: 3,
        ordinal: 1,
        userPid: currentUser.pid,
      });
    });
  });
});

describe("GET /categories/:pid", () => {
  itBehavesLike("aControllerShowAction", {
    factory: categoryFactory,
    url: "/categories/:pid",
  });
});

describe("PATCH /categories/:pid", () => {
  itBehavesLike("aControllerUpdateAction", {
    factory: categoryFactory,
    url: "/categories/:pid",
    updateAttributes: { category: { title: "new title" } },
  });
});

describe("DELETE /categories/:pid", () => {
  itBehavesLike("aControllerDeleteAction", {
    factory: categoryFactory,
    url: "/categories/:pid",
  });
});
