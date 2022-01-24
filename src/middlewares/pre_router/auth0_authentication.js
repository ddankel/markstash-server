const { auth } = require("express-oauth2-jwt-bearer");
console.log("og file");

// TODO:
// - find or create user
// - set req.user param.  Req.auth.user?

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
});

module.exports = checkJwt;
