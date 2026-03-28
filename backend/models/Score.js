const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  userId: String,
  score: Number,
  date: String
});

module.exports = mongoose.model("score", scoreSchema);