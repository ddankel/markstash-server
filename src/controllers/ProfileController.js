exports.show = async (req, res) => {
  res.sendData(req.currentUser);
};
