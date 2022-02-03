const { Model } = require("objection");
const AjvValidator = require("objection").AjvValidator;
const { randomBytes } = require("crypto");
const { omit } = require("lodash");

class BaseModel extends Model {
  /************************************************************
   *  OBJECTION CONFIG
   */

  static get modelPaths() {
    return [__dirname];
  }

  /**
   * Customize the AJV validator for models
   *
   * By default AJV doesn't recognize the `example` keyword, so it is manaully
   * allowed below.
   */
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        ajv.addKeyword("example");
      },
    });
  }

  /************************************************************
   *  CALLBACKS
   */

  /**
   * Callbacks to fire both on beforeSave and beforeInsert
   *
   * This template does nothing and should be overwritten as necessary in
   * model classes.
   */
  async $beforeSave(payload, opt, queryContext) {}

  /**
   * Callbacks to fire before insert actions
   *
   * - Set createdAt & updatedAt dates
   * - Populate the PID field
   * - Perform the onSave callback
   */
  async $beforeInsert(queryContext) {
    this.updatedAt = new Date();
    this.createdAt = new Date();
    this.pid = await this.#uniquePID(queryContext.transaction);

    await this.$beforeSave({ ...this }, undefined, queryContext);
  }

  /**
   * Callbacks to fire before update actions
   *
   * - Update updatedAt property
   * - Perform the onSave callback
   */
  async $beforeUpdate(opt, queryContext) {
    this.updatedAt = new Date();

    const payload = { ...opt.old, ...this };
    await this.$beforeSave(payload, opt, queryContext);
  }

  /************************************************************
   *  PUBLIC STATIC METHODS
   */

  /**
   * Retrieve the model instance with the provided PID.
   *
   * Raises a NotFound Error if no record is found
   *
   * @param   {String}  pid  PID to search for
   * @param   {Knedc}   txn  Knex transaction object (optional)
   *
   * @return  {Promise}      Resolving to the model instance (if found)
   */
  static findByPid(pid, txn) {
    return this.query(txn).findOne("pid", pid).throwIfNotFound();
  }

  /************************************************************
   *  PUBLIC INSTANCE METHOD
   */

  /**
   * Reload this model instance's attributes from the database
   *
   * This method both sets the internal attributes and returns this instance to
   * allow method chaining.
   *
   * @return  {Promise}  Resolves to this model
   */
  async $reload() {
    const reFetchedValues = await this.$query();
    this.$set(reFetchedValues);
    return this;
  }

  /**
   * Exporst this model as a JSON object
   *
   * Model IDs are suppressed from display... APIs use the PID instead.
   *
   * @param   {ToJsonOptions}  options  @see https://vincit.github.io/objection.js/api/types/#type-tojsonoptions
   *
   * @return  {Object}         JSON representation of this model instance
   */
  toJSON({ shallow, virtuals } = {}) {
    const obj = super.toJSON({ shallow, virtuals });
    return omit(obj, "id");
  }

  /************************************************************
   *  PRIVATE INSTANCE METHODS
   */

  /**
   * Generate a unique PID for this model
   *
   * @return {Promise}  Resolving to the unique PID string
   */
  async #uniquePID(txn) {
    let pid = randomBytes(3).toString("hex");
    const collision = await this.$modelClass.query(txn).where({ pid });
    if (collision.length) {
      pid = await this.#uniquePID(txn);
    }
    return pid;
  }
}

module.exports = BaseModel;
