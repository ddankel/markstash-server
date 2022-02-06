const { userFactory } = require("../../factories");

/**
 * Mock the auth0Authentication middleware
 *
 * Instead of authenticating the bearer token with Auth0, the following
 * behavoir is performed:
 *
 * If there is no Bearer token...
 *   ...act as if the token was invalid.  Interrupt execution and return a
 *      401 response
 * If there is a Bearer token...
 *   ...and a username is provided (see below)...
 *      ...find or create a user record with the provided auth0Id and username
 *   ...and no username is provided...
 *      ...find or create a user record with the provided auth0Id, and also use
 *         that as the username
 *
 * Bearer Token format:
 *
 * The bearer token is expected to be in the Authorization header, set in a test like:
 *
 *     response = await request(app).get("/profile").set("Authorization", "Bearer TOKEN").send();
 *
 * TOKEN may be one of the following:
 * - "auth0Id"
 * - "auth0Id:username"
 *
 * where auth0Id is the value of that field to find or create a user record
 * on.  Username, if provided, will be assigned to the user's username
 * property.  If username is not provided, the auth0Id will be reused.
 *
 * @param   {[type]}  user  [user description]
 * @param   {[type]}  true  [true description]
 *
 * @return  {[type]}        [return description]
 */
const mockAuth0Authentication = () => {
  jest.mock("../../../src/middlewares/preRouter/auth0Authentication", () =>
    jest.fn((req, res, next) => {
      const bearerToken = req.header("Authorization");

      if (!bearerToken) return res.status(401).send();

      const [auth0Id, username] = bearerToken.split(":");
      const payload = {
        "http://org.auth0.markstash/username": username || auth0Id,
        sub: auth0Id,
      };

      req.auth = { payload };

      next();
    })
  );
};

module.exports = mockAuth0Authentication;
