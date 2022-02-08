const request = require("supertest");
const app = require("../helpers/mockExpressApp")();

const sharedExamples = ({ factory, url, updateAttributes }) => {
  const getUrl = (pid) => url.replace(":pid", pid);

  describe("when not authenticated", () => {
    it("responds 401 Unauthenticated", async () => {
      await request(app).patch(getUrl(1)).expect(401);
    });
  });

  describe("when accessing another user's instance", () => {
    it("responds 401 Unauthenticated", async () => {
      const instance = await factory.create();
      await request(app).patch(getUrl(instance.pid)).set("Authorization", "somePid").expect(401);
    });
  });

  describe("when accessing owned instance", () => {
    it("responds 200 OK with the updated instance", async () => {
      const instance = await factory.create();
      const currentUser = await instance.owner();
      const response = await request(app)
        .patch(getUrl(instance.pid))
        .set("Authorization", currentUser.auth0Id)
        .send(updateAttributes);

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toMatchObject({
        pid: instance.pid,
        ...updateAttributes[Object.keys(updateAttributes)[0]],
      });
    });
  });
};

module.exports = sharedExamples;
