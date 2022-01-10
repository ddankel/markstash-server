/**
 * Move the collection to the specified category and column
 *
 * @param   {Collection}  collection  The Collection to move
 * @param   {Category}        category        The Category to place the collection within
 * @param   {Integer}     column      The column to place the collection at
 * @param   {Knex}        txn         Knex transaction object
 *
 * @return  {Collection}              The updated Collection
 */
module.exports = async function moveToCategory(collection, category, column, txn) {
  if (collection.categoryPid === category.pid && collection.column === column) {
    // Already associated correctly
    return collection;
  }

  await collection
    .$query(txn)
    .patch({ categoryPid: category.pid, column: column, ordinal: undefined });
  return await collection.$reload();
};
