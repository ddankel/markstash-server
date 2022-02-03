const { xorWith, isEqual } = require("lodash");
const util = require("util");

const inspect = (obj) => util.inspect(obj, { showHidden: false, depth: null, colors: true });

module.exports = {
  /**
   * Compares the ids of two arrays of Objection models
   *
   * All instances must respond to both .id or .pid or an exception will be
   * thrown.  This matcher passes if all of the .ids and .pids in the subject
   * and target match.
   */
  toMatchIds(subject, target) {
    const subjectIds = [subject].flat().map((item) => [item.id, item.pid]);
    const targetIds = [target].flat().map((item) => [item.id, item.pid]);
    const difference = xorWith(subjectIds, targetIds, isEqual);

    const message = () =>
      "Expected:\n" +
      inspect(targetIds) +
      "\n\nRecieved:\n" +
      inspect(subjectIds) +
      "\n\nDifference:\n" +
      inspect(difference);

    return {
      pass: !difference.length,
      message,
    };
  },
};
