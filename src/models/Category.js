const { Model } = require("objection");
const { copyWithoutUndefined } = require("knex-utils");

const BaseModel = require("./BaseModel");
const categorieschema = require("./schemas/categorySchema");

const unique = require("objection-unique")({ fields: [["userPid", "ordinal"]] });

class Category extends unique(BaseModel) {
  static get tableName() {
    return "categories";
  }

  static get jsonSchema() {
    return categorieschema;
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: "User",
        join: {
          from: "categories.userPid",
          to: "users.pid",
        },
      },
      collections: {
        relation: Model.HasManyRelation,
        modelClass: "Collection",
        join: {
          from: "categories.pid",
          to: "collections.categoryPid",
        },
      },
    };
  }

  /************************************************************
   *  CALLBACKS
   */

  async $beforeSave(payload, _opt, queryContext) {
    if (!payload.ordinal) await this.#assignDefaultOrdinal(payload, queryContext);
  }

  /************************************************************
   *  PUBLIC INSTANCE METHODS
   */

  async owner() {
    return this.$relatedQuery("user");
  }

  /************************************************************
   *  PRIVATE INSTANCE METHODS
   */

  /**
   * Fetch all this category's siblings
   *
   * This method is used to do things like require fields be unique but only
   * across related instances.
   *
   * @return  {QueryBuilder}  The query to fetch the peers
   * @async
   */
  #fetchSiblings(payload, queryContext) {
    const userPid = payload.userPid || payload.user_pid;

    return Category.query(queryContext.transaction)
      .whereNot(copyWithoutUndefined({ id: payload.id }))
      .where(copyWithoutUndefined({ user_pid: userPid }));
  }

  /**
   * Sets .ordinal to the default value if it is currently undefined
   *
   * @param {Boolean} override  If true, updates even if ordinal is defined (default = false)
   * @async
   */
  async #assignDefaultOrdinal(payload, queryContext, override = false) {
    if (payload.ordinal !== undefined && !override) return;

    const siblings = await this.#fetchSiblings(payload, queryContext);
    const ordinal = siblings.length ? Math.max(...siblings.map((item) => item.ordinal)) + 1 : 1;
    payload.ordinal = this.ordinal = ordinal;
  }
}

module.exports = Category;
