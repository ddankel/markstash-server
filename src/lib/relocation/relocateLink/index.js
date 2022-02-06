const Link = require("../../../models/Link");
const moveToGroup = require("./moveToGroup");
const moveItemToOrdinal = require("../shared/moveItemToOrdinal");
const compactOrdinals = require("../shared/compactOrdinals");
const Group = require("../../../models/Group");

/**
 * Relocate the link to a specified group and ordinal
 *
 * @param   {Link}     link     The Link to move
 * @param   {Group}    group    The Group to place the link under
 * @param   {Integer}  ordinal  The ordinal to assign to the link
 *
 * @return  {Array<Link>}       Sorted link list, post-insert
 */
module.exports = async function relocateLink({ link, group, ordinal }) {
  try {
    return await Group.transaction(async (txn) => {
      // Associate the link to the group
      await moveToGroup(link, group, txn);

      // Set the group's ordinal (and make room if necessary)
      const list = await siblingLinks(link, txn);
      await moveItemToOrdinal(link, list, ordinal, txn);

      // Compact the ordinals
      return compactOrdinals(await siblingLinks(link, txn), txn);
    });
  } catch (err) {
    throw err;
  }
};

/**
 * Fetch the provided link's siblings (in the provided transaction)
 *
 * Sibling links are links assocaited with the group that is associated with
 * the subject sibling (ie the link's parent's children)
 *
 * @param   {Link}  link  The subject link
 * @param   {knex}  txn   The knex transaction to work within
 *
 * @return  {Array<Link>}        The sibling links
 */
const siblingLinks = async (link, txn) => {
  const group = await link.$relatedQuery("group", txn);
  return await group.$relatedQuery("links", txn);
};
