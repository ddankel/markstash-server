const createSendData = (req, res, next) => {
  return (payload) => res.send({ data: payload });
};

const createSendError = (req, res, next) => {
  return (payload) => res.send({ error: payload });
};

const attachSenders = (req, res, next) => {
  res.sendData = createSendData(req, res, next);
  res.sendError = createSendError(req, res, next);
  next();
};

module.exports = attachSenders;
