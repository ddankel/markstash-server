const { auth } = require("express-oauth2-jwt-bearer");

console.log("real mw");

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

module.exports = checkJwt;
