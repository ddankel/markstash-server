const { isEqual } = require("lodash");
const { HttpUnauthorizedError } = require("../../lib/errors");

const attachAuthorizer = (req, res, next) => {
  /**
   * Validate each item passed to authorize has the current user as its owner
   *
   * If the req.currentUser is not set, or if req.currentUser is not the owner
   * of the resource, HttpUnauthorizedError will be thrown.  Otherwise the
   * resource will be returned.
   *
   * This middleware-attached method uses Promise.resolve on the resource
   * provided.  This eliminates the need to 'await' any async operations used
   * to provide this parameter.
   *
   * @example
   * const Link = await authorize(Link.findById(req.params.id))
   *
   * The above valid without having to use 'await User.find...'
   *
   */
  req.authorize = async (resource) => {
    if (!req.currentUser) {
      throw new HttpUnauthorizedError();
    }

    const instance = await Promise.resolve(resource);
    if (!isEqual(await instance.owner(), req.currentUser)) {
      throw new HttpUnauthorizedError();
    }

    return instance;
  };
  next();
};

module.exports = attachAuthorizer;
