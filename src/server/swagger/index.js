const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerComponents = require("./components");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: process.env.npm_package_name,
    version: process.env.npm_package_version,
    description: process.env.npm_package_description,
    // license: {
    //   name: "Licensed Under MIT",
    //   url: "https://spdx.org/licenses/MIT.html",
    // },
    contact: {
      name: process.env.npm_package_author_name,
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routers/*.js"], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

// Add components
swaggerSpec.components = swaggerComponents;

// const util = require("util");
// console.log(
//   "SWAGGERSPEC:",
//   util.inspect(swaggerSpec.components.requestBodies.Category, {
//     showHidden: false,
//     depth: null,
//     colors: true,
//   })
// );

const useSwagger = (app) => app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = useSwagger;
