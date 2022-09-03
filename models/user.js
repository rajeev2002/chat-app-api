const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  mail: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);
