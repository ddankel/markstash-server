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

const { auth } = require("express-oauth2-jwt-bearer");
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

app.get("/api/public", (req, res) => {
  res.json({ message: "This is the public endpoint" });
});

app.get("/api/protected", checkJwt, async (req, res) => {
  // const response = await fetch(`${serverUrl}/api/protected`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  // const responseData = await response.json();

  console.log(req.auth.payload);

  res.json({ message: "this is the private endpoint", payload: req.auth.payload });
});

// Post-Route Middleware
middlewares.usePostRouteMiddlewares(app);

module.exports = app;
