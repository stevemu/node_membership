let assert = require("assert");

let User = function (args) {
  assert.ok(args.username, "username is required");
  let user = {};

  if (args._id) {
    user._id = args._id;
  }

  user.username = args.username;
  user.signInCount = args.signInCount || 0;
  user.hashedPassword = args.hashedPassword || null;

  return user;
};

module.exports = User;
