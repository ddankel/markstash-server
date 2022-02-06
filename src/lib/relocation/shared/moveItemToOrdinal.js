/**
 * Update specified item to the specified ordinal
 *
 * If the ordinal is already occupied by another item in the list, it (and any
 * other blocking items) will have their ordinals bumped to accomodate.
 *
 * @param   {Model}         item     The item to set the ordinal of
 * @param   {Array<Model>}  list     List of related items the `item` belongs in
 * @param   {Integer}       ordinal  The ordinal to insert the item into
 * @param   {Knex}          txn      Knex transaction object
 *
 * @return  {Model}           The updated item
 */
module.exports = async function moveItemToOrdinal(item, list, ordinal, txn) {
  if (item.ordinal === ordinal) {
    return item;
  }

  const blockingItem = itemAtOrdinal(list, ordinal);

  if (blockingItem) {
    await moveItemToOrdinal(blockingItem, list, ordinal + 1, txn);
  }

  await item.$query(txn).patch({ ordinal: ordinal });

  return item;
};

/**
 * Fetch the item from the list at the provided ordinal
 *
 * @param   {Array<Model>}  list     List of items
 * @param   {Integer}       ordinal  Ordinal to find item at
 *
 * @return  {Model, undefined}       Item at the specified ordinal, or undefined
 */
const itemAtOrdinal = (list, ordinal) => {
  return list.find((item) => item.ordinal === ordinal);
};
