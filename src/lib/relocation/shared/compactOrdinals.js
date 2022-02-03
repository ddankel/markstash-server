/**
 * Remove vacancies in the lists's ordinals
 *
 * IE ordinals will be rewritten to be 1, 2, 3...
 *
 * @param   {Array}  list  List of items to be compacted
 * @param   {Knex}   txn   Knex transaction object
 *
 * @return  {Array}        Sorted list of items post-compacting
 */
module.exports = async function compactOrdinals(list, txn) {
  const sortedList = list.sort((a, b) => a.ordinal - b.ordinal);

  let index = 1;
  for (const item of sortedList) {
    await item.$query(txn).patch({ ordinal: index++ });
  }

  return sortedList;
};
