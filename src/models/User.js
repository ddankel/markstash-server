const { Model } = require("objection");

const BaseModel = require("./BaseModel");
const userSchema = require("./schemas/userSchema");

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
