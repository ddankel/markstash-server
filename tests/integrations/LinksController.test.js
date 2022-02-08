const request = require("supertest");
const { Link } = require("../../src/models");
const { linkFactory, groupFactory } = require("../factories");
const mockExpressApp = require("../helpers/mockExpressApp");
const { itBehavesLike } = require("../sharedExamples");

const app = mockExpressApp();

describe("GET /groups/1/links", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).get("/groups/1/links").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 200 OK with the user's groups", async () => {
      const group = await groupFactory.create();
      await linkFactory.createList(3, { groupPid: group.pid });
      const currentUser = await group.owner();
      const response = await request(app)
        .get(`/groups/${group.pid}/links`)
        .set("Authorization", currentUser.auth0Id);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toMatchPids(await group.$relatedQuery("links"));
    });
  });
});

describe("POST /groups/1/links", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).post("/groups/1/links").expect(401);
    });
  });

  describe("when authenticated", () => {
    it("responds 201 with the new instance", async () => {
      const linkAttributes = linkFactory.build();
      const group = await groupFactory.create();
      const currentUser = await group.owner();
      const response = await request(app)
        .post(`/groups/${group.pid}/links`)
        .set("Authorization", currentUser.auth0Id)
        .send({ link: linkAttributes });

      expect(response.statusCode).toBe(201);
      expect(response.body.data).toMatchObject({
        ...linkAttributes,
        ordinal: 1,
        groupPid: group.pid,
      });
    });
  });
});

describe("GET /links/:pid", () => {
  itBehavesLike("aControllerShowAction", {
    factory: linkFactory,
    url: "/links/:pid",
  });
});

describe("PATCH /links/:pid", () => {
  itBehavesLike("aControllerUpdateAction", {
    factory: linkFactory,
    url: "/links/:pid",
    updateAttributes: { link: { title: "new title" } },
  });
});

describe("DELETE /links/:pid", () => {
  itBehavesLike("aControllerDeleteAction", {
    factory: linkFactory,
    url: "/links/:pid",
  });
});
