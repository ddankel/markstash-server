const categoryPid = {
  name: "category_pid",
  in: "path",
  required: true,
  description: "PID of the category to operate on",
  schema: {
    type: "string",
  },
};

module.exports = categoryPid;
