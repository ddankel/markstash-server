const groupPid = {
  name: "group_pid",
  in: "path",
  required: true,
  description: "PID of the group to operate on",
  schema: {
    type: "string",
  },
};

module.exports = groupPid;
