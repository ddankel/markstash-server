const request = require("supertest");
const mockAuthMiddleware = require("../tests/helpers/mock_auth");

// jest.mock("./middlewares/pre_router/auth0_authentication", () =>
//   jest.fn((req, res, next) => {
//     console.log("in auth mock");
//     next();
//   })
// );

// beforeEach();

// mockAuthMiddleware();
// const app = require("./app");

let app = mockAuthMiddleware();

describe("GET /api/public", () => {
  it("works", async () => {
    await request(app).get("/api/public").expect(200);
  });
});

describe("GET /api/protected", () => {
  describe("with invalid credentials", () => {
    it("doesn't authenticate", async () => {
      await request(app).get("/api/protected").expect(401);
      // console.log(await request(app).get("/api/protected"));
    });
  });

  describe("with a bearer token", () => {
    it("authenticates", async () => {
      console.log(`Bearer ${global.validAuthToken}`);

      await request(app)
        .get("/api/protected")
        .set("Authorization", `Bearer ${global.validAuthToken}`)
        .expect(200);
    });
  });
});
