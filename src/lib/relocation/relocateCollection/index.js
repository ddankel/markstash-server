const Collection = require("../../../models/collection");
const moveCollectionToCategory = require("./moveCollectionToCategory");
const moveItemToOrdinal = require("../shared/moveItemToOrdinal");
const compactOrdinals = require("../shared/compactOrdinals");

/**
 * Relocate the collection to a specified category and column and ordinal
 *
 * @param   {Collection}  collection  The Collection to move
 * @param   {Category}    category    The category to place the collection under
 * @param   {Integer}     column      The column to place the collection in
 * @param   {Integer}     ordinal     The ordinal to assign to the collection
 *
 * @return  {Array<Collection>}       Sorted collection list, post-insert
 */
module.exports = async function relocateCollection({ collection, category, column, ordinal }) {
  try {
    return await Collection.transaction(async (txn) => {
      // Associate the collection to the category
      await moveCollectionToCategory(collection, category, column, txn);

      // Set the collection's ordinal (and make room for it if necessary)
      const list = await siblingCollections(collection, txn);
      await moveItemToOrdinal(collection, list, ordinal, txn);

      // Compact the ordinals
      return compactOrdinals(await siblingCollections(collection, txn), txn);
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Fetch the provided collection's siblings (in the provided transaction)
 *
 * Sibling collections are collections associated with the category that is
 * associated with the subject sibling (ie the collection's parent's children)
 *
 * @param   {Collection}  collection  The subject collection
 * @param   {knex}  txn  Knex transaction to do work within
 *
 * @return  {Array<Collection>} The sibling collections
 */
const siblingCollections = async (collection, txn) => {
  const category = await collection.$relatedQuery("category", txn);
  return await category.$relatedQuery("collections", txn);
};
