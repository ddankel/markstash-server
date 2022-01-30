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

  static get relationMappings() {
    return {
      categories: {
        relation: Model.HasManyRelation,
        modelClass: "Category",
        join: {
          from: "users.pid",
          to: "categories.userPid",
        },
      },
    };
  }
}

module.exports = User;
