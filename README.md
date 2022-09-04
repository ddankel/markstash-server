# Markstash-Server

A backend server for the Markstash bookmark storage system. Links can be sorted through three levels of categorization:

    ┬ Category
    └┬ Collection
     └┬ Group
      └─ Link

Users are only able to create, read, update, or delete their own bookmarks.

### Purpose

This project was written as a practice Node.js server application and as a practice integrating the packages listed below (see: Built With). The front end piece was put on hold to work on other projects, but the server can be started and tested using the Swagger UI (see: Installation below).

### Built With

- **Core Web Server**
  - [Node.js](https://nodejs.org/) - Runtime environment
  - [Express](https://expressjs.com/) - Web framework to handle requests
  - [Auth0](https://auth0.com/) - Request authentication and authorization
  - [Swagger](https://swagger.io/) & [Swagger UI](https://swagger.io/tools/swagger-ui/) - Visual API endpoint documentation powered by in-line comments.
- **Data Storage**
  - [Objection.js](https://vincit.github.io/objection.js/) - An ORM for Node.js.
  - [Knex.js](https://knexjs.org/) - SQL query builder which powers Objection.js
- **Test Suite**
  - [Jest](https://jestjs.io/) - Testing framework
  - [Fishery](https://github.com/thoughtbot/fishery) - [Thoughtbot](https://thoughtbot.com/)'s Javascript version of their factory_bot gem for ruby. It integrated easily with Objection.js.
  - [Supertest](https://github.com/visionmedia/supertest) - Used for controller integration tests against each endpoint.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ddankel/markstash-server
   ```
2. Install packages
   ```sh
   yarn install
   ```
3. Create an `.env` file with Auth0 keys and MySQL connection info. See `.env.sample` for details.

4. Run database migrations

   ```sh
   yarn migrate
   # (an alias for `yarn knex migrate:latest`)
   ```

5. Run (swagger)

   ```sh
   yarn swagger
   ```

   This launches the server with `NODE_ENV` set to `swagger` and mounts the SwaggerUI docs at [http://localhost:8000/docs/](http://localhost:8000/docs/). Starting the server in any other environment (development, test, or production) will not mount the SwaggerUI pages.

## Contact

Project Link: [https://github.com/ddankel/markstash-server](https://github.com/ddankel/markstash-server)
