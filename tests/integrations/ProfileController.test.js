const request = require("supertest");
const User = require("../../src/models/User");
const mockExpressApp = require("../helpers/mockExpressApp");

const app = mockExpressApp();

describe("GET /profile", () => {
  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).get("/profile").expect(401);
    });
  });

  describe("when authenticated", () => {
    beforeEach(async () => {
      response = await request(app).get("/profile").set("Authorization", "faketoken").send();
    });

    it("responds 200 OK", () => {
      expect(response.statusCode).toBe(200);
    });

    it("responds with the user's record", async () => {
      const user = await User.query().findOne({ auth0Id: "faketoken" });

      expect(response.body.data).toEqual({
        pid: user.pid,
        username: user.username,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });
  });
});
