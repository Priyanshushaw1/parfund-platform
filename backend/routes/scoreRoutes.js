const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// ADD SCORE (max 5 logic)
router.post("/add", async (req, res) => {
  const { userId, value, date } = req.body;

  await Score.create({ userId, value, date });

  let scores = await Score.find({ userId }).sort({ date: -1 });

  if (scores.length > 5) {
    const extra = scores.slice(5);
    for (let s of extra) {
      await Score.findByIdAndDelete(s._id);
    }
  }

  res.json({ message: "Score saved" });
});

// GET SCORES
router.get("/:userId", async (req, res) => {
  const scores = await Score.find({ userId: req.params.userId }).sort({ date: -1 });
  res.json(scores);
});

module.exports = router;