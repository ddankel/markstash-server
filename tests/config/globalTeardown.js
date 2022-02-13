// Exported method will run once after all tests are finished
module.exports = async () => {
  // Close knex connection
  global.knex.destroy();
};
