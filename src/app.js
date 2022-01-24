require("dotenv").config();
const express = require("express");
const middlewares = require("./middlewares");
const useSwagger = require("./server/swagger");

const checkJwt = require("./middlewares/pre_router/auth0_authentication");

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

app.get("/api/public", (req, res) => {
  res.json({ message: "This is the public endpoint" });
});

app.get("/api/protected", checkJwt, async (req, res) => {
  console.log("IN PROTECTED");
  // console.log(req.auth.payload); //.sub = unique id

  req.auth = { payload: "foo" };

  res.json({ message: "this is the private endpoint", payload: req.auth.payload });
});

// Post-Route Middleware
middlewares.usePostRouteMiddlewares(app);

module.exports = app;
