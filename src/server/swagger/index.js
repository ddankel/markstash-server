const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerComponents = require("./components");
const swaggerAuth0 = require("./swaggerAuth0");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: process.env.npm_package_name,
    version: process.env.npm_package_version,
    description: process.env.npm_package_description,
    contact: {
      name: process.env.npm_package_author_name,
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:8000",
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

const useSwagger = (app) => {
  app.use(swaggerAuth0);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        requestInterceptor: (request) => {
          request.headers.Authorization = "Bearer swagger|test_token:Swagger";
          return request;
        },
      },
    })
  );
};

module.exports = useSwagger;
