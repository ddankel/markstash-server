/**
 * Move the link to the specified group
 *
 * @param   {Link}   link   The Link to move
 * @param   {Group}  group  The Group to place the link within
 * @param   {Knex}   txn    Knex transaction object
 *
 * @return  {Link}          The updated Link
 */
module.exports = async function moveToGroup(link, group, txn) {
  if (link.groupPid === group.pid) {
    // already associated correctly
    return link;
  }

  await link.$query(txn).patch({ groupPid: group.pid, ordinal: undefined });
  return await link.$reload();
};
