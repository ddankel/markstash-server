const request = require("supertest");
const app = require("../helpers/mockExpressApp")();

const sharedExamples = ({ factory, url }) => {
  const getUrl = (pid) => url.replace(":pid", pid);

  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).delete(getUrl(1)).expect(401);
    });
  });

  describe("when accessing another user's instance", () => {
    it("responds 401 Unauthenticated", async () => {
      const instance = await factory.create();
      await request(app).delete(getUrl(instance.pid)).set("Authorization", "somePid").expect(401);
    });
  });

  describe("when accessing owned instance", () => {
    it("responds 200 OK with the updated instance", async () => {
      const instance = await factory.create();
      const currentUser = await instance.owner();
      const response = await request(app)
        .delete(getUrl(instance.pid))
        .set("Authorization", currentUser.auth0Id);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toMatchPids(instance);
    });
  });
};

module.exports = sharedExamples;
