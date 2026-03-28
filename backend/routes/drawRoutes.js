const express = require("express");
const router = express.Router();
const Draw = require("../models/Draw");
const Score = require("../models/Score");

// 🎯 generate draw
router.get("/run", async (req, res) => {
  try {
    let nums = [];

    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }

    nums.sort((a, b) => a - b);

    const newDraw = new Draw({ numbers: nums });
    await newDraw.save();

    res.json({ draw: nums });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧠 check result
router.get("/check/:userId", async (req, res) => {
  try {
    const lastDraw = await Draw.findOne().sort({ date: -1 });
    const userScores = await Score.find({ userId: req.params.userId });

    if (!lastDraw) return res.json({ message: "No draw yet" });

    let matches = 0;

    userScores.forEach(s => {
      if (lastDraw.numbers.includes(s.score)) {
        matches++;
      }
    });

    res.json({
      draw: lastDraw.numbers,
      matches,
      result:
        matches >= 5 ? "🏆 Jackpot!" :
        matches >= 4 ? "🎉 Great win!" :
        matches >= 3 ? "👍 Small win!" :
        "😢 No win"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;