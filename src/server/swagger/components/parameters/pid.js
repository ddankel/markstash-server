const pid = {
  name: "id",
  in: "path",
  required: true,
  description: "PID of the resource to operate on",
  schema: {
    type: "string",
  },
};

module.exports = pid;
