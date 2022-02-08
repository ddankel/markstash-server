require("dotenv").config();
const express = require("express");
const middlewares = require("./middlewares");
const useSwagger = require("./server/swagger");

// Server Configurations
const app = express();
require("express-async-errors");
require("./server/objectionjs");
useSwagger(app);

// TODO HELMET

const cors = require("cors");
app.use(cors({ origin: process.env.AUTH0_ORIGIN }));

// Pre-Route Middleware
middlewares.usePreRouteMiddlewares(app);

// Application Routes
// app.get("/", (req, res) => res.redirect(302, "https://github.com/ddankel/task-app--nodejs"));
app.use(require("./routers/collections"));
app.use(require("./routers/links"));
app.use(require("./routers/categories"));
app.use(require("./routers/groups"));
app.use(require("./routers/profile"));

// AUTH TESTING START
const checkJwt = require("./middlewares/preRouter/auth0Authentication");
app.get("/api/public", (req, res) => {
  res.json({ message: "This is the public endpoint" });
});

app.get("/api/protected", checkJwt, async (req, res) => {
  console.log("IN PROTECTED");
  // console.log(req.auth.payload); //.sub = unique id

  req.auth = { payload: "foo" };

  console.log("---------");
  // console.log("req", req);
  console.log("auth", req.auth);
  console.log("payload", req.auth.payload);

  // const AuthenticationClient = require("auth0").AuthenticationClient;
  // var auth0 = new AuthenticationClient({
  //   domain: process.env.AUTH0_DOMAIN,
  //   clientId: process.env.AUTH0_CLIENT_ID,
  //   clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // });

  // let accessToken;
  // try {
  //   const result = await auth0.clientCredentialsGrant({
  //     audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
  //     // scope: "read:users",
  //   });

  //   // console.log("RESULT", result);
  //   accessToken = result.access_token;
  // } catch (e) {
  //   console.log("ERRR", e);
  // }

  // console.log("USER ID", req.auth.payload.sub);
  // const util = require("util");
  // const request = require("request");
  // const a_request = util.promisify(request);

  // const rr = await a_request(
  //   `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${req.auth.payload.sub}`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${accessToken}`,
  //     },
  //   }
  // );
  // console.log("RES", rr.body);

  res.json({ message: "this is the private endpoint", payload: req.auth.payload });
});
// AUTH TESTING END

// Post-Route Middleware
middlewares.usePostRouteMiddlewares(app);

module.exports = app;
