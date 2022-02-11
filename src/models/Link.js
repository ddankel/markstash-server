const { Model } = require("objection");
const BaseModel = require("./BaseModel");
const { copyWithoutUndefined } = require("knex-utils");

const linkSchema = require("./schemas/linkSchema");

const unique = require("objection-unique")({ fields: [["groupPid", "ordinal"]] });

class Link extends unique(BaseModel) {
  static get tableName() {
    return "links";
  }

  static get jsonSchema() {
    return linkSchema;
  }

  static get relationMappings() {
    return {
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: "Group",
        join: {
          from: "links.groupPid",
          to: "groups.pid",
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

  /**
   * Fetch the owner of this instance, determined by its parent's owner
   *
   * @return  {User}
   * @async
   */
  async owner() {
    const parent = await this.$relatedQuery("group");
    return parent.owner();
  }

  /************************************************************
   *  PRIVATE INSTANCE METHODS
   */

  /**
   * Fetch all links related to the provided instance
   *
   * This method is used to do things like require fields be unique but only
   * across related instances.
   *
   * @return  {QueryBuilder}  The query to fetch the peers
   * @async
   */
  #fetchSiblings(payload, queryContext) {
    const groupPid = payload.groupPid || payload.group_pid;
    return Link.query(queryContext.transaction)
      .whereNot(copyWithoutUndefined({ id: payload.id }))
      .where("groupPid", groupPid);
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
    const ordinal = siblings.length ? Math.max(siblings.map((item) => item.ordinal)) + 1 : 1;
    payload.ordinal = this.ordinal = ordinal;
  }
}

module.exports = Link;
