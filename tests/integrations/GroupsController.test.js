const request = require("supertest");
const { groupFactory, collectionFactory } = require("../factories");
const mockExpressApp = require("../helpers/mockExpressApp");
const { itBehavesLike } = require("../sharedExamples");

const app = mockExpressApp();

describe("GET /collections/1/groups", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).get("/collections/1/groups").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 200 OK with the user's collections", async () => {
      const collection = await collectionFactory.create();
      await groupFactory.createList(3, { collectionPid: collection.pid });
      const currentUser = await collection.owner();
      const response = await request(app)
        .get(`/collections/${collection.pid}/groups`)
        .set("Authorization", currentUser.auth0Id);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toMatchPids(await collection.$relatedQuery("groups"));
    });
  });
});

describe("POST /collections/1/groups", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).post("/collections/1/groups").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 201 with the new instance", async () => {
      const groupAttributes = groupFactory.build();
      const collection = await collectionFactory.create();
      const currentUser = await collection.owner();
      const response = await request(app)
        .post(`/collections/${collection.pid}/groups`)
        .set("Authorization", currentUser.auth0Id)
        .send({ group: groupAttributes });

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toMatchObject({
        ...groupAttributes,
        ordinal: 2,
        collectionPid: collection.pid,
      });
    });
  });
});

describe("GET /groups/:pid", () => {
  itBehavesLike("aControllerShowAction", {
    factory: groupFactory,
    url: "/groups/:pid",
  });
});

describe("PATCH /groups/:pid", () => {
  itBehavesLike("aControllerUpdateAction", {
    factory: groupFactory,
    url: "/groups/:pid",
    updateAttributes: { group: { title: "new title" } },
  });
});

describe("DELETE /groups/:pid", () => {
  itBehavesLike("aControllerDeleteAction", {
    factory: groupFactory,
    url: "/groups/:pid",
  });
});
