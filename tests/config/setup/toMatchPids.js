const { xorWith, isEqual } = require("lodash");
const util = require("util");

const inspect = (obj) => util.inspect(obj, { showHidden: false, depth: null, colors: true });

module.exports = {
  /**
   * Compares the pids of two arrays of Objection models
   *
   * All instances must respond to .pid or an exception will be thrown.  This
   * matcher passes if all of the .ids and .pids in the subject and target
   * match.
   */
  toMatchPids(subject, target) {
    const subjectPids = [subject].flat().map((item) => item.pid);
    const targetPids = [target].flat().map((item) => item.pid);
    const difference = xorWith(subjectPids, targetPids, isEqual);

    const message = () =>
      "Expected:\n" +
      inspect(targetPids) +
      "\n\nRecieved:\n" +
      inspect(subjectPids) +
      "\n\nDifference:\n" +
      inspect(difference);

    return {
      pass: !difference.length,
      message,
    };
  },
};
