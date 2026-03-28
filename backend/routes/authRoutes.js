const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "User Registered ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) {
    res.json({ message: "Login Success ✅", user });
  } else {
    res.status(401).json({ message: "Invalid Credentials ❌" });
  }
});

module.exports = router;