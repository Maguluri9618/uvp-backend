const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const User = require("./models/User"); // ✅ import your user model

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection ✅
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Test Route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Server is working! ✅" });
});

// ➕ POST /api/users — create user
app.post("/api/users", async (req, res) => {
  try {
    const { name, whatsappNumber, email } = req.body;

    const newUser = new User({ name, whatsappNumber, email });
    await newUser.save();

    res.status(201).json({ message: "User created successfully ✅", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Error creating user ❌", error: error.message });
  }
});

// 📥 GET /api/users — list all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
