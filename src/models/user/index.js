const { Model } = require("objection");

const BaseModel = require("../base_model");
const userSchema = require("./user.schema");

class User extends BaseModel {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return userSchema;
  }
}

module.exports = User;
