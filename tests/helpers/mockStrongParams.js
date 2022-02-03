const mockStrongParams = (params) => ({
  require: () => ({ permit: () => ({ value: () => params }) }),
});

module.exports = mockStrongParams;
