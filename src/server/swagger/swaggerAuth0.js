// Sample auth0 response:
// req.auth.payload =
// {
//  'http://org.auth0.markstash/username': 'dd.personal',
//   iss: 'https://????.us.auth0.com/',
//   sub: 'auth0|?????',
//   aud: [
//     'http://localhost:8000',
//     'https://?????.us.auth0.com/userinfo'
//   ],
//   iat: 1643253919,
//   exp: 1643340319,
//   azp: 'egXdjh3QKHdmg4OLLNErhRixuEG4xZ42',
//   scope: 'openid profile email'
// }
const swaggerAuth0 = (req, res, next) => {
  let bearerToken = req.header("Authorization");
  bearerToken = bearerToken?.replace(/^Bearer/, "");

  if (!bearerToken) return next();

  const [auth0Id, username] = bearerToken.split(":");
  const payload = {
    "http://org.auth0.markstash/username": username || auth0Id,
    sub: auth0Id,
  };

  req.auth = { payload };

  next();
};

module.exports = swaggerAuth0;
