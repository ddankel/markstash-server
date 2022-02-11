require("dotenv").config();
const express = require("express");
const middlewares = require("./middlewares");
const useSwagger = require("./server/swagger");

// Server Configurations
const app = express();
require("express-async-errors");
require("./server/objectionjs");

if (process.env.NODE_ENV === "swagger") {
  useSwagger(app);
}

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
  res.json({ message: "this is the private endpoint", payload: req.auth.payload });
});
// AUTH TESTING END

// Post-Route Middleware
middlewares.usePostRouteMiddlewares(app);

module.exports = app;
