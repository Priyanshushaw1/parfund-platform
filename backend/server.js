const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // 🔥 important

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const drawRoutes = require("./routes/drawRoutes");

app.use("/api/draw", drawRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);

// 🔥 MongoDB Atlas Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Atlas Connected 🔥"))
.catch(err => console.log("DB Error:", err));

// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});