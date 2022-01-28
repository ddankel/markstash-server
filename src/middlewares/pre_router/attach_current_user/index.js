const User = require("../../../models/user");

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
const attachCurrentUser = async (req, res, next) => {
  if (!!req?.auth?.payload?.sub) {
    const auth0Id = req.auth.payload.sub;
    const username = req.auth.payload["http://org.auth0.markstash/username"];

    const user = await User.transaction(async (txn) => {
      let u = await User.query(txn).findOne({ auth0Id });
      if (!u) u = await User.query(txn).insert({ auth0Id });
      await u.$query(txn).patch({ username });
      return u;
    });

    req.current_user = user;
  }
  next();
};

module.exports = attachCurrentUser;
