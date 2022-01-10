require("dotenv").config();
const express = require("express");
const middlewares = require("./middlewares");
const useSwagger = require("./server/swagger");

// Server Configurations
const app = express();
require("express-async-errors");
require("./server/objectionjs");
useSwagger(app);

// Pre-Route Middleware
middlewares.usePreRouteMiddlewares(app);

// Application Routes
// app.get("/", (req, res) => res.redirect(302, "https://github.com/ddankel/task-app--nodejs"));
app.use(require("./routers/collections"));
app.use(require("./routers/links"));
app.use(require("./routers/categories"));
app.use(require("./routers/groups"));

// Post-Route Middleware
middlewares.usePostRouteMiddlewares(app);

module.exports = app;
