const { Model } = require("objection");
const { copyWithoutUndefined } = require("knex-utils");

const BaseModel = require("../base_model");
const groupschema = require("./group.schema");
const ModelValidationError = require("../../errors/model_validation_error");

class Group extends BaseModel {
  static get tableName() {
    return "groups";
  }

  static get jsonSchema() {
    return groupschema;
  }

  static get relationMappings() {
    return {
      collection: {
        relation: Model.BelongsToOneRelation,
        modelClass: "Collection",
        join: {
          from: "groups.collectionPid",
          to: "collections.pid",
        },
      },
      links: {
        relation: Model.HasManyRelation,
        modelClass: "Link",
        join: {
          from: "groups.pid",
          to: "links.groupPid",
        },
      },
    };
  }

  /************************************************************
   *  CALLBACKS
   */

  async $beforeSave(payload, _opt, queryContext) {
    if (!payload.ordinal) await this.#assignDefaultOrdinal(payload, queryContext);
    await this.#validateUniqueOrdinal(payload, queryContext);
  }

  /************************************************************
   *  PRIVATE INSTANCE METHODS
   */

  /**
   * Fetch all groups related to the provided instance
   *
   * This method is used to do things like require fields be unique but only
   * across related instances.
   *
   * @return  {QueryBuilder}  The query to fetch the peers
   * @async
   */
  #fetchSiblings(payload, queryContext) {
    const collectionPid = payload.collectionPid || payload.collection_pid;
    return Group.query(queryContext.transaction)
      .whereNot(copyWithoutUndefined({ id: payload.id }))
      .where(copyWithoutUndefined({ collection_pid: collectionPid }));
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

  /**
   * Validate that .ordinal is unique among peer categories
   *
   * @async
   */
  async #validateUniqueOrdinal(payload, queryContext) {
    if (!payload.ordinal) return;

    const siblings = await this.#fetchSiblings(payload, queryContext);
    const ordinals = siblings.map((row) => row.ordinal);
    if (!ordinals.includes(payload.ordinal)) return;

    throw new ModelValidationError({
      field: "ordinal",
      message: "should be unique",
      keyword: "unique",
    });
  }
}

module.exports = Group;
