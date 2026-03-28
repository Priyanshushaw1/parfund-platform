const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// add score
router.post("/add", async (req, res) => {
  try {
    const newScore = new Score(req.body);
    await newScore.save();
    res.json({ message: "Score Saved ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 get scores by user (YE IMPORTANT HAI)
router.get("/:userId", async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.params.userId });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;