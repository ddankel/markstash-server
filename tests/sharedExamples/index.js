const itBehavesLike = (exampleName, args) => {
  const sharedExamples = require(`./${exampleName}`);
  sharedExamples(args);
};

exports.itBehavesLike = itBehavesLike;
