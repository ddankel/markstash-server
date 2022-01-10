const Group = require("../../../models/group");
const moveToCollection = require("./move_to_collection");
const moveItemToOrdinal = require("../shared/move_item_to_ordinal");
const compactOrdinals = require("../shared/compact_ordinals");

module.exports = async function relocateGroup({ group, collection, ordinal }) {
  try {
    return await Group.transaction(async (txn) => {
      // Associate the group to the collection
      await moveToCollection(group, collection, txn);

      // Set the group's ordinal (and make room for it if necessary)
      const list = await siblingGroups(group, txn);
      await moveItemToOrdinal(group, list, ordinal, txn);

      // Compact the ordinals
      return compactOrdinals(await siblingGroups(group, txn), txn);
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Fetch the provided group's siblings (in the provided transaction)
 *
 * Sibling groups are groups associated with the collection that is
 * associated with the subject sibling (ie the group's parent's children)
 *
 * @param   {Group}   group  The subject group
 * @param   {knex}  txn  Knex transaction to do work within
 *
 * @return  {Array<Collection>} The sibling collections
 */
const siblingGroups = async (group, txn) => {
  const collection = await group.$relatedQuery("collection", txn);

  return await collection.$relatedQuery("groups", txn);
};
