const collectionPid = {
  name: "collection_pid",
  in: "path",
  required: true,
  description: "PID of the collection to operate on",
  schema: {
    type: "string",
  },
};

module.exports = collectionPid;
