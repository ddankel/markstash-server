const { Model } = require("objection");
const { copyWithoutUndefined } = require("knex-utils");

const BaseModel = require("./BaseModel");
const collectionSchema = require("./schemas/collectionSchema");

const unique = require("objection-unique")({ fields: [["categoryPid", "column", "ordinal"]] });

class Collection extends unique(BaseModel) {
  static get tableName() {
    return "collections";
  }

  static get jsonSchema() {
    return collectionSchema;
  }

  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: "Category",
        join: {
          from: "collections.categoryPid",
          to: "categories.pid",
        },
      },
      groups: {
        relation: Model.HasManyRelation,
        modelClass: "Group",
        join: {
          from: "collections.pid",
          to: "groups.collectionPid",
        },
      },
    };
  }

  /************************************************************
   *  CALLBACKS
   */

  async $afterInsert(context) {
    await this.$relatedQuery("groups", context.transaction).insert({ title: "Default" });
  }

  async $beforeSave(payload, _opt, queryContext) {
    if (!payload.ordinal) await this.#assignDefaultOrdinal(payload, queryContext);
  }

  /************************************************************
   *  PUBLIC INSTANCE METHODS
   */

  async owner() {
    const parent = await this.$relatedQuery("category");
    return parent.owner();
  }

  /************************************************************
   *  PRIVATE INSTANCE METHODS
   */

  /**
   * Fetch this collection's siblings
   *
   * This method is used to do things like require fields be unique but only
   * across siblings.
   */
  #fetchSiblings(payload, queryContext) {
    const categoryPid = payload.categoryPid || payload.category_pid;
    return Collection.query(queryContext.transaction)
      .whereNot(copyWithoutUndefined({ id: payload.id }))
      .where(copyWithoutUndefined({ category_pid: categoryPid }))
      .where(copyWithoutUndefined({ column: payload.column }));
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

module.exports = Collection;
