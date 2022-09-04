/**
 * Move the group to the specified collection
 *
 * @param   {Group}       group       The Group to move
 * @param   {Collection}  collection  The Collection to place the group within
 * @param   {Knex}        txn         Knex transaction object
 *
 * @return  {Group}                   The updated Group
 */
module.exports = async function moveGroupToCollection(group, collection, txn) {
  if (group.collectionPid === collection.pid) {
    // already associated correctly
    return group;
  }

  await group.$query(txn).patch({ collectionPid: collection.pid, ordinal: undefined });
  return await group.$reload();
};
